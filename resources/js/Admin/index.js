/**
 * Dayal Sweets - Admin Module Re-exports
 *
 * This provides convenient access to all Admin product pages:
 * - ProductIndex  -> GET    /admin/products (get_all)
 * - ProductCreate -> GET    /admin/products/create (create form)
 * - ProductEdit   -> GET    /admin/products/{id}/edit (edit form)
 * - ProductShow   -> GET    /admin/products/{id} (get by id)
 */

export { default as ProductIndex } from '@/Pages/Admin/Products/Index';
export { default as ProductCreate } from '@/Pages/Admin/Products/Create';
export { default as ProductEdit } from '@/Pages/Admin/Products/Edit';
export { default as ProductShow } from '@/Pages/Admin/Products/Show';
