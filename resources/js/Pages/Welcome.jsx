import SeoHead from '@/Components/SeoHead';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import Hero from '@/Components/home/Hero';
import HomeSections from '@/Components/home/HomeSections';

export default function Welcome({ auth, products = [], categories = [], page = null }) {
    return (
        <>
            <SeoHead
                page={page}
                fallbackTitle="Dayal Sweets | Authentic Indian Mithai, Snacks, Dining & Gifting Since 1962"
                fallbackDescription="Order authentic handmade Indian sweets, pure desi ghee mithai, namkeen, bakery treats, and festive gift hampers online from Dayal Sweets."
            />
            <div className="dayal-site">
                <Header auth={auth} />
                <main><Hero /><HomeSections products={products} categories={categories} /></main>
                <Footer />
            </div>
        </>
    );
}
