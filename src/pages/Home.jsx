import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

import backgroundImage from '../assets/images/background3.jpg';
import backgroundImage4 from '../assets/images/background4.jpg';
import { FaWhatsapp, FaInstagram, FaFacebookF, FaTiktok, FaChevronRight, FaChevronLeft } from 'react-icons/fa';


import icon from '../assets/images/icon.png';
import logo from '../assets/images/logomricoclear.png';
import { useEffect, useState, useRef } from "react";

import { getPublicEvents } from '../supabase/eventsController';



import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { faMountain, faTasks } from '@fortawesome/free-solid-svg-icons';

import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';


export default function Home() {

    const [events, setEvents] = useState([]);


    const fetchEvents = async () => {
        try {
            const data = await getPublicEvents();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };


    useEffect(() => {
        fetchEvents();
    }, []);


    const tentangKamiRef = useRef(null);
    const hubungiKamiRef = useRef(null);

    const scrollToSection = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });
    return (

        <div className="scroll-smooth min-h-screen flex flex-col bg-white items-center ">
            <div className="h-screen w-full flex flex-col bg-cover" style={{ backgroundImage: `url(${backgroundImage})` }}>
                <div className='flex items-center h-[80px] w-full justify-between px-4 md:px-8 bg-transparent backdrop-blur-md z-10'>
                    <img className='w-[70px] h-[70px] md:w-[80px] md:h-[80px]' src={logo} alt="logo" />
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-0"></div>

                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="relative z-10 flex flex-col justify-center items-center md:items-start w-full h-full text-white text-center md:text-left px-6 md:px-12">
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold">Kelompok Informasi Masyarakat</h1>
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold">Padukuhan <span className='text-green-600'>Mrico</span></h2>
                    <p className="font-semibold md:text-md sm:text-md text-gray-200 mt-4 max-w-full md:max-w-2xl">
                        Media informasi warga, oleh warga, untuk warga. Bersama, kita bangun desa yang terhubung, aktif, dan penuh semangat gotong royong.
                    </p>
                    <div className='flex flex-col sm:flex-row mt-6 gap-4 w-full sm:w-auto'>
                        <div onClick={() => scrollToSection(tentangKamiRef)}
                            className='w-full sm:w-[150px] md:w-[250px] py-2 px-3 sm:px-4 bg-green-700 font-bold text-sm sm:text-base flex items-center justify-center border-2 border-green-700 rounded-3xl hover:bg-white hover:text-green-700 cursor-pointer'>
                            <p className='mr-2'>Tentang Kami</p>
                            <FaChevronRight />
                        </div>
                        <div onClick={() => scrollToSection(hubungiKamiRef)}
                            className='w-full sm:w-[150px] md:w-[250px] py-2 px-3 sm:px-4 bg-transparent backdrop-blur-4xl font-bold text-sm sm:text-base flex items-center justify-center border-2 rounded-3xl hover:bg-white hover:text-green-700 cursor-pointer'>
                            Hubungi Kami
                        </div>
                    </div>
                </motion.div>
            </div>



            <div

                className="w-full my-12 relative h-full px-4  md:px-8">
                <h1 className='text-black font-bold text-2xl sm:text-3xl md:text-4xl mx-2 md:mx-4'>Berita dan Informasi di Mrico</h1>
                <hr className='w-[50%] sm:w-[35%] text-green-500 border-3 mx-2 md:mx-4 mt-4' />
                <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hide-scrollbar flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth p-4">
                    {events.map((event, index) => (
                        <div key={index} className="min-w-[250px] sm:min-w-[300px] max-w-[300px] h-[500px] sm:h-[500px] bg-white shadow-lg rounded-lg p-4 flex flex-col hover:shadow-md hover:-translate-y-2 transition-transform duration-200">
                            <img className="w-full h-[120px] sm:h-[150px] object-cover rounded" src={event.image_url} alt={`Event ${index}`} />
                            <div className="mt-2">
                                <p className="text-xl sm:text-2xl font-bold break-words">{event.title}</p>
                                <hr className="my-2 text-gray-400" />
                                <p className="text-sm font-medium text-gray-500">{event.description}</p>
                            </div>
                            <p className="mt-auto self-end text-xs text-gray-400 font-bold">
                                {new Intl.DateTimeFormat('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(event.event_date))}
                            </p>
                        </div>
                    ))}
                </motion.div>
            </div>


            <h1 className='text-3xl font-bold '>Tujuan Kami</h1>
            <hr className='w-[12%] text-green-500 border-3 mx-4 mt-4' />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className='flex flex-col md:flex-row gap-8 items-center justify-center w-[90%] md:w-[80%] mx-auto my-12'>
                <div className='flex flex-col items-center w-full md:w-1/2 h-auto md:h-[450px] px-4 py-6 rounded-lg bg-white shadow-lg hover:scale-105 transition-transform'>
                    <p className='text-black text-xl sm:text-2xl font-bold text-center mt-4'>Visi</p>
                    <div className='flex items-center justify-center w-[50px] h-[50px] p-4 rounded-[50%] bg-green-200 my-6'>
                        <FontAwesomeIcon icon={faMountain} className="text-3xl text-green-800" />
                    </div>
                    <p className='text-black text-sm font-semibold break-words text-center mt-1 md:mt-12'>
                        Mewujudkan masyarakat Desa Mrico yang melek informasi, aktif berpartisipasi, dan terlibat dalam pembangunan desa melalui penyebaran informasi yang cepat, tepat, dan terpercaya.
                    </p>
                </div>

                <div className='flex flex-col items-center justify-center w-full md:w-1/2 h-auto md:h-[450px] px-4 py-6 rounded-lg bg-white shadow-lg hover:scale-105 transition-transform'>
                    <p className='text-black text-xl sm:text-2xl font-bold text-center mt-4'>Misi</p>
                    <div className='flex items-center justify-center w-[50px] h-[50px] p-4 rounded-[50%] bg-green-200 my-6'>
                        <FontAwesomeIcon icon={faTasks} className="text-3xl text-green-800" />
                    </div>
                    <div className='flex items-center justify-center gap-2'>
                        <div className='flex items-center justify-center w-[8px] h-[8px] p-3 rounded-[50%] bg-green-800 my-6'>
                            <p className='text-white text-sm'>1</p>
                        </div>
                        <p className='text-black text-sm font-semibold break-words '>
                            Menyebarluaskan informasi kegiatan desa kepada seluruh lapisan masyarakat secara rutin dan transparan.
                        </p>
                    </div>
                    <div className='flex items-center justify-center gap-2'>
                        <div className='flex items-center justify-center w-[8px] h-[8px] p-3 rounded-[50%] bg-green-800 my-6'>
                            <p className='text-white text-sm'>2</p>
                        </div>
                        <p className='text-black text-sm font-semibold break-words '>
                            Menyebarluaskan informasi kegiatan desa kepada seluruh lapisan masyarakat secara rutin dan transparan.
                        </p>
                    </div>
                    <div className='flex items-center justify-center gap-2'>
                        <div className='flex items-center justify-center w-[8px] h-[8px] p-3 rounded-[50%] bg-green-800 my-6'>
                            <p className='text-white text-sm'>3</p>
                        </div>
                        <p className='text-black text-sm font-semibold break-words '>
                            Menyebarluaskan informasi kegiatan desa kepada seluruh lapisan masyarakat secara rutin dan transparan.
                        </p>
                    </div>
                    <div className='flex items-center justify-center gap-2'>
                        <div className='flex items-center justify-center w-[8px] h-[8px] p-3 rounded-[50%] bg-green-800 my-6'>
                            <p className='text-white text-sm'>4</p>
                        </div>
                        <p className='text-black text-sm font-semibold break-words '>
                            Menyebarluaskan informasi kegiatan desa kepada seluruh lapisan masyarakat secara rutin dan transparan.
                        </p>
                    </div>

                </div>
            </motion.div>
            <div
                ref={tentangKamiRef}
                className='bg-white w-full flex items-center justify-center bg-cover py-12 px-4 sm:px-6'
                style={{ backgroundImage: `url(${backgroundImage4})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    ref={ref}
                    className='flex flex-col w-full max-w-full md:max-w-[60%] mx-auto h-full justify-center bg-black/30 backdrop-blur-md rounded-xl shadow-lg p-6 md:p-12'
                >
                    <div className='flex flex-col w-full p-4 sm:p-6 text-center'>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Tentang Kami</h1>
                        <div className='w-[60px] md:w-[90px] h-[4px] bg-white self-center'></div>
                        <p className="text-white text-sm sm:text-base mt-6 sm:mt-8 md:mt-10 text-center leading-relaxed">
                            Kelompok Informasi Masyarakat (KIM) Padukuhan Mrico merupakan sebuah wadah partisipatif warga yang bertujuan untuk menyebarluaskan informasi secara tepat, akurat, dan bermanfaat kepada masyarakat. KIM Mrico hadir sebagai jembatan antara pemerintah, media, dan warga dalam hal pengelolaan informasi serta penguatan literasi digital di lingkungan padukuhan.

                            Melalui KIM, masyarakat didorong untuk aktif dalam proses komunikasi dua arah—tidak hanya sebagai penerima informasi, tetapi juga sebagai pengelola dan penyampai informasi lokal yang positif. Kami juga menjadi penggerak kegiatan sosial dan edukatif yang mendukung pembangunan desa berbasis informasi.

                            KIM Mrico terbuka bagi seluruh warga yang ingin berkontribusi dalam menciptakan ekosistem informasi yang sehat, inklusif, dan memberdayakan. Dengan semangat gotong royong dan teknologi, kami berkomitmen untuk memajukan Padukuhan Mrico melalui transparansi informasi, partisipasi publik, dan peningkatan literasi masyarakat.

                        </p>
                    </div>
                </motion.div>
            </div>

            <div ref={hubungiKamiRef} className='bg-[#10181a] w-full flex flex-col gap-6 p-4 md:p-8'>
                <div className='flex flex-col md:flex-row items-center md:justify-between gap-6'>
                    <p className='font-bold text-lg md:text-2xl text-white text-center md:text-left md:w-[55%]'>
                        KIM Padukuhan Mrico – "Satu Suara, Satu Informasi, Satu Tujuan." Media terpercaya bagi masyarakat desa.
                    </p>

                    <div className='flex gap-4 items-start justify-center md:justify-start'>

                        <div className='flex flex-col gap-4 text-white items-center md:items-start'>
                            <a href="https://wa.me/6281234567890" className='flex gap-2 hover:text-green-400 hover:scale-105 transform transition-transform duration-200' target="_blank" >
                                <FaWhatsapp className="text-green-500  mt-1" />
                                <p>+62 812-2534-2580</p>
                            </a>
                            <a href="https://wa.me/6281234567890" className='flex gap-2 hover:text-pink-400 hover:scale-105 transform transition-transform duration-200' target="_blank" >
                                <FaInstagram className="text-pink-500  mt-1" />
                                <p>@KIMMrico</p>
                            </a>
                        </div>

                        <div className='flex flex-col gap-4 text-white items-center md:items-start'>

                            <a href="https://wa.me/6281234567890" className='flex gap-2 hover:text-blue-400 hover:scale-105 transform transition-transform duration-200' target="_blank" >
                                <FaFacebookF className="text-blue-600  mt-1" />
                                <p>@KIMMrico</p>
                            </a>
                            <a href="https://wa.me/6281234567890" className='flex gap-2 hover:text-gray-400 hover:scale-105 transform transition-transform duration-200 ' target="_blank" >
                                <FaTiktok className="text-white  mt-1" />
                                <p>@KIMMrico</p>
                            </a>
                        </div>
                    </div>
                </div>
                <hr className='w-full text-white mt-4' />
                <p className='text-white text-center md:text-left text-sm md:text-md mt-4'>© 2025 KIM Padukuhan Mrico</p>
            </div>
        </div>


    );
}
