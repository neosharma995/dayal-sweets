import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import Hero from '@/Components/home/Hero';
import HomeSections from '@/Components/home/HomeSections';

export default function Welcome({ auth, products = [], categories = [] }) {
    return (
        <>
            <Head title="Dayal Sweets" />
            <div className="dayal-site">
                <Header auth={auth} />
                <main><Hero /><HomeSections products={products} categories={categories} /></main>
                <Footer />
            </div>
        </>
    );
}
