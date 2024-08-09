import { useSession, signIn, signOut } from "next-auth/react"
import Nav from "./Nav";
import { useState } from "react";
import Logo from "./Logo";

export default function Layout({ children }) {
    const [showNav, setShowNav] = useState(false);
    const { data: session } = useSession();
    if (!session) {
        return (
            <div style={{ backgroundColor: '#E8F6EF', border: '2px solid #4C4C6D' }} className='bg-bgGray w-sreen h-screen flex items-center'>
                <div className='text-center w-full'>
                    <h2 style={{ color: '#4C4C6D' }} className='text-2xl font-bold mb-4'>Đăng nhập admin</h2>
                    <button onClick={() => signIn('google')} style={{ backgroundColor: '#1B9C85', color: 'white' }} className='p-2 px-4 rounded-lg'>Đăng nhập với Google</button>
                </div>
            </div>
        );
    }
    return (
        <div className="bg-bgGray min-h-screen">
            <div className="block md:hidden flex items-center p-4">
                <button onClick={() => setShowNav(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
                    </svg>
                </button>
                <div className="flex grow justify-center mr-6">
                    <Logo></Logo>
                </div>

            </div>

            <div className='flex'>
                <Nav show={showNav}></Nav>
                <div className=" flex-grow p-4">
                    {children}
                </div>
            </div>
        </div>

    );
}
