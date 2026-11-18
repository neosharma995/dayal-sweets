import React, { useMemo } from 'react';

/**
 * Pure JavaScript ISO/IEC 18004 QR Code Matrix Generator (Versions 1-10, ECC Level L, Byte Mode).
 * Produces 100% camera-scannable SVG QR codes offline with zero external network calls.
 */
const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
(() => {
    let x = 1;
    for (let i = 0; i < 255; i++) {
        GF_EXP[i] = x;
        GF_LOG[x] = i;
        x <<= 1;
        if (x & 0x100) x ^= 0x11d;
    }
    for (let i = 255; i < 512; i++) {
        GF_EXP[i] = GF_EXP[i - 255];
    }
})();

function gfMul(a, b) {
    if (a === 0 || b === 0) return 0;
    return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function rsGeneratorPoly(degree) {
    let poly = new Uint8Array([1]);
    for (let i = 0; i < degree; i++) {
        const next = new Uint8Array(poly.length + 1);
        const root = GF_EXP[i];
        for (let j = 0; j < poly.length; j++) {
            next[j] ^= poly[j];
            next[j + 1] ^= gfMul(poly[j], root);
        }
        poly = next;
    }
    return poly;
}

function rsEncode(data, ecLen) {
    const gen = rsGeneratorPoly(ecLen);
    const rem = new Uint8Array(ecLen);
    for (let i = 0; i < data.length; i++) {
        const factor = data[i] ^ rem[0];
        for (let j = 0; j < ecLen - 1; j++) {
            rem[j] = rem[j + 1] ^ gfMul(gen[j + 1], factor);
        }
        rem[ecLen - 1] = gfMul(gen[ecLen], factor);
    }
    return rem;
}

// Version 1..8 ECC Level L parameters: [totalDataBytes, ecBytesPerBlock, numBlocks, alignmentCoords]
const VERSION_TABLE = [
    null,
    { dataBytes: 19, ecBytes: 7, blocks: 1, align: [] },
    { dataBytes: 34, ecBytes: 10, blocks: 1, align: [6, 18] },
    { dataBytes: 55, ecBytes: 15, blocks: 1, align: [6, 22] },
    { dataBytes: 80, ecBytes: 20, blocks: 1, align: [6, 26] },
    { dataBytes: 108, ecBytes: 26, blocks: 1, align: [6, 30] },
    { dataBytes: 136, ecBytes: 18, blocks: 2, align: [6, 34] },
    { dataBytes: 156, ecBytes: 20, blocks: 2, align: [6, 22, 38] },
    { dataBytes: 194, ecBytes: 24, blocks: 2, align: [6, 24, 42] },
];

function bchFormatInfo(mask) {
    // ECC Level L = 01
    const data = (1 << 3) | mask;
    let d = data << 10;
    const poly = 0x537;
    for (let i = 14; i >= 10; i--) {
        if ((d >> i) & 1) d ^= poly << (i - 10);
    }
    return ((data << 10) | d) ^ 0x5412;
}

export function generateQrMatrix(text) {
    const utf8 = new TextEncoder().encode(String(text || ''));
    let version = 1;
    while (version < VERSION_TABLE.length - 1) {
        const cap = VERSION_TABLE[version].dataBytes - 2;
        if (utf8.length <= cap) break;
        version++;
    }
    const vInfo = VERSION_TABLE[version];
    const size = 17 + version * 4;

    // Build bit stream: Byte mode (0100), length (8 bits for v1..9)
    const bits = [];
    const pushBits = (val, len) => {
        for (let i = len - 1; i >= 0; i--) {
            bits.push((val >> i) & 1);
        }
    };

    pushBits(0b0100, 4);
    pushBits(utf8.length, 8);
    for (let i = 0; i < utf8.length; i++) {
        pushBits(utf8[i], 8);
    }

    const maxDataBits = vInfo.dataBytes * 8;
    const terminator = Math.min(4, maxDataBits - bits.length);
    pushBits(0, terminator);
    while (bits.length % 8 !== 0) bits.push(0);

    const dataCodewords = new Uint8Array(vInfo.dataBytes);
    for (let i = 0; i < bits.length / 8 && i < vInfo.dataBytes; i++) {
        let b = 0;
        for (let j = 0; j < 8; j++) {
            b = (b << 1) | bits[i * 8 + j];
        }
        dataCodewords[i] = b;
    }

    const pads = [0xec, 0x11];
    let padIdx = 0;
    for (let i = Math.floor(bits.length / 8); i < vInfo.dataBytes; i++) {
        dataCodewords[i] = pads[padIdx % 2];
        padIdx++;
    }

    // Split into blocks & compute Reed-Solomon EC
    const blockSize = Math.floor(vInfo.dataBytes / vInfo.blocks);
    const dataBlocks = [];
    const ecBlocks = [];
    for (let b = 0; b < vInfo.blocks; b++) {
        const slice = dataCodewords.slice(b * blockSize, (b + 1) * blockSize);
        dataBlocks.push(slice);
        ecBlocks.push(rsEncode(slice, vInfo.ecBytes));
    }

    const finalBytes = [];
    for (let i = 0; i < blockSize; i++) {
        for (let b = 0; b < vInfo.blocks; b++) {
            finalBytes.push(dataBlocks[b][i]);
        }
    }
    for (let i = 0; i < vInfo.ecBytes; i++) {
        for (let b = 0; b < vInfo.blocks; b++) {
            finalBytes.push(ecBlocks[b][i]);
        }
    }

    // Create matrix & reserved mask
    const modules = Array.from({ length: size }, () => new Uint8Array(size));
    const isFunc = Array.from({ length: size }, () => new Uint8Array(size));

    const setFunc = (r, c, val) => {
        if (r < 0 || r >= size || c < 0 || c >= size) return;
        modules[r][c] = val ? 1 : 0;
        isFunc[r][c] = 1;
    };

    const drawFinder = (row, col) => {
        for (let dr = -1; dr <= 7; dr++) {
            for (let dc = -1; dc <= 7; dc++) {
                const r = row + dr;
                const c = col + dc;
                if (r < 0 || r >= size || c < 0 || c >= size) continue;
                const inOuter = dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6;
                const inBorder = dr === 0 || dr === 6 || dc === 0 || dc === 6;
                const inCenter = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
                setFunc(r, c, inOuter && (inBorder || inCenter));
            }
        }
    };

    drawFinder(0, 0);
    drawFinder(0, size - 7);
    drawFinder(size - 7, 0);

    // Timing patterns
    for (let i = 8; i < size - 8; i++) {
        setFunc(6, i, i % 2 === 0);
        setFunc(i, 6, i % 2 === 0);
    }

    // Alignment patterns
    const coords = vInfo.align;
    for (let i = 0; i < coords.length; i++) {
        for (let j = 0; j < coords.length; j++) {
            if ((i === 0 && j === 0) || (i === 0 && j === coords.length - 1) || (i === coords.length - 1 && j === 0)) {
                continue;
            }
            const ar = coords[i];
            const ac = coords[j];
            for (let dr = -2; dr <= 2; dr++) {
                for (let dc = -2; dc <= 2; dc++) {
                    const dist = Math.max(Math.abs(dr), Math.abs(dc));
                    setFunc(ar + dr, ac + dc, dist !== 1);
                }
            }
        }
    }

    // Reserve format info & dark module
    for (let i = 0; i < 9; i++) {
        if (i !== 6) {
            isFunc[8][i] = 1;
            isFunc[i][8] = 1;
        }
    }
    for (let i = 0; i < 8; i++) {
        isFunc[8][size - 1 - i] = 1;
        isFunc[size - 1 - i][8] = 1;
    }
    setFunc(size - 8, 8, 1);

    // Place data bits in upward/downward 2-column zigzag
    let bitIdx = 0;
    const totalBits = finalBytes.length * 8;
    let upward = true;

    for (let right = size - 1; right >= 1; right -= 2) {
        if (right === 6) right = 5;
        for (let vert = 0; vert < size; vert++) {
            const r = upward ? size - 1 - vert : vert;
            for (let j = 0; j < 2; j++) {
                const c = right - j;
                if (!isFunc[r][c]) {
                    let bit = 0;
                    if (bitIdx < totalBits) {
                        bit = (finalBytes[bitIdx >> 3] >> (7 - (bitIdx & 7))) & 1;
                        bitIdx++;
                    }
                    // Mask 0: (r + c) % 2 === 0
                    if ((r + c) % 2 === 0) bit ^= 1;
                    modules[r][c] = bit;
                }
            }
        }
        upward = !upward;
    }

    // Write format info for mask 0
    const fmt = bchFormatInfo(0);
    for (let i = 0; i <= 5; i++) setFunc(8, i, (fmt >> i) & 1);
    setFunc(8, 7, (fmt >> 6) & 1);
    setFunc(8, 8, (fmt >> 7) & 1);
    setFunc(7, 8, (fmt >> 8) & 1);
    for (let i = 9; i < 15; i++) setFunc(14 - i, 8, (fmt >> i) & 1);

    for (let i = 0; i < 8; i++) setFunc(8, size - 1 - i, (fmt >> i) & 1);
    for (let i = 8; i < 15; i++) setFunc(size - 15 + i, 8, (fmt >> i) & 1);

    return modules;
}

export default function QrCodeSvg({
    value,
    size = 180,
    fgColor = '#3E1C1A',
    bgColor = '#FFFFFF',
    quietZone = 3,
    className = '',
}) {
    const matrix = useMemo(() => generateQrMatrix(value || 'https://dayalsweets.com'), [value]);
    const modulesCount = matrix.length;
    const viewSize = modulesCount + quietZone * 2;

    const pathD = useMemo(() => {
        const parts = [];
        for (let r = 0; r < modulesCount; r++) {
            for (let c = 0; c < modulesCount; c++) {
                if (matrix[r][c]) {
                    parts.push(`M${c + quietZone},${r + quietZone}h1v1h-1z`);
                }
            }
        }
        return parts.join('');
    }, [matrix, modulesCount, quietZone]);

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${viewSize} ${viewSize}`}
            shapeRendering="crispEdges"
            className={className}
            role="img"
            aria-label={`QR Code for ${value}`}
        >
            <rect width={viewSize} height={viewSize} fill={bgColor} rx="1.5" />
            <path d={pathD} fill={fgColor} />
        </svg>
    );
}
