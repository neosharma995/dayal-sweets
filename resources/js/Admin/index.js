/**
 * Dayal Sweets - Admin Module Re-exports
 *
 * Products:
 * - ProductIndex  -> GET    /admin/products (get_all)
 * - ProductCreate -> GET    /admin/products/create (create form)
 * - ProductEdit   -> GET    /admin/products/{id}/edit (edit form)
 * - ProductShow   -> GET    /admin/products/{id} (get by id)
 *
 * Categories:
 * - CategoryIndex  -> GET   /admin/categories (get_all)
 * - CategoryCreate -> GET   /admin/categories/create (create form)
 * - CategoryEdit   -> GET   /admin/categories/{id}/edit (edit form)
 * - CategoryShow   -> GET   /admin/categories/{id} (get by id & see products)
 */

export { default as ProductIndex } from '@/Pages/Admin/Products/Index';
export { default as ProductCreate } from '@/Pages/Admin/Products/Create';
export { default as ProductEdit } from '@/Pages/Admin/Products/Edit';
export { default as ProductShow } from '@/Pages/Admin/Products/Show';

export { default as CategoryIndex } from '@/Pages/Admin/Categories/Index';
export { default as CategoryCreate } from '@/Pages/Admin/Categories/Create';
export { default as CategoryEdit } from '@/Pages/Admin/Categories/Edit';
export { default as CategoryShow } from '@/Pages/Admin/Categories/Show';
