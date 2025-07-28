// src/pages/Dashboard.jsx
import { useEffect, useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserAndEvents, createEvent, updateEvent, deleteEvent } from '../supabase/eventsController';
import supabase from '../supabase/supabaseClient';
import { Dialog, Transition } from '@headlessui/react';

export default function Dashboard() {
    const [events, setEvents] = useState([]);
    const [form, setForm] = useState({ title: '', description: '', event_date: '', image: null });
    const [editingId, setEditingId] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setForm({ title: '', description: '', event_date: '', image: null });
        setEditingId(null);
        setPreviewUrl(null);
    };

    const openDeleteModal = (id) => {
        setDeleteId(id);
        setIsDeleteOpen(true);
    };
    const closeDeleteModal = () => {
        setDeleteId(null);
        setIsDeleteOpen(false);
    };

    const fetchEvents = async () => {
        try {
            const { user, data } = await getUserAndEvents();
            if (!user) {
                navigate('/login');
                return;
            }
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };


    useEffect(() => {
        fetchEvents();
    }, []);



    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'image') {
            const file = files[0];
            setForm((prev) => ({ ...prev, image: file }));

        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateEvent(editingId, form);
            } else {
                await createEvent(form);
            }
            fetchEvents();
            closeModal();
        } catch (error) {
            console.error('Submit error:', error);
        }
    };

    const handleEdit = (event) => {
        setForm({
            title: event.title,
            description: event.description,
            event_date: event.event_date,
            image: null,
        });

        setEditingId(event.id);
        openModal();
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteEvent(deleteId);
            fetchEvents();
            closeDeleteModal();
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const [text, setText] = useState("");
    const maxLength = 255;
    const maxLengthTitle = 70;

    return (
        <>
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>

                <button onClick={openModal} className="bg-blue-500 mb-8 text-white px-4 py-2 rounded hover:bg-blue-600 active:scale-95 transition-transform duration-100">
                    Tambahkan Event
                </button>

                {events.length === 0 ? (
                    <p className="text-gray-500">No events found.</p>
                ) : (
                    <ul className="space-y-4">
                        {events.map((event) => (
                            <li key={event.id} className="p-4 bg-white shadow rounded">
                                <h2 className="text-xl font-semibold">{event.title}</h2>
                                <p className="text-gray-700">{event.description}</p>
                                <p className="text-sm text-gray-500 mt-2">Tanggal Event: {event.event_date}</p>
                                <p className="text-xs text-gray-400">Dibuat pada: {new Date(event.created_at).toLocaleString()}</p>
                                {event.image_url && (
                                    <img src={event.image_url} alt={event.title} className="w-full max-w-42 max-h-64 object-cover rounded mt-2" />
                                )}
                                <div className="space-x-2 mt-2">
                                    <button onClick={() => handleEdit(event)} className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 active:scale-95 transition-transform duration-100 text-white rounded">
                                        Ubah
                                    </button>
                                    <button onClick={() => openDeleteModal(event.id)} className="px-3 py-1 bg-red-600 hover:bg-red-700 active:scale-95 transition-transform duration-100 text-white rounded">
                                        Hapus
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <Transition appear show={isModalOpen} as={Fragment}>

                <Dialog onClose={closeModal} className="relative z-50">
                    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">

                            <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 shadow-xl">
                                <Dialog.Title className="text-lg font-bold mb-4">
                                    {editingId ? 'Ubah Event' : 'Tambah Event'}
                                </Dialog.Title>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <input maxLength={70} name="title" value={form.title} onChange={handleChange} placeholder="Judul Event" className="w-full p-2 border rounded" required />
                                    <div className="text-sm text-gray-500">
                                        {form.title.length}/{maxLengthTitle} karakter
                                    </div>
                                    {form.title.length >= maxLengthTitle && (
                                        <p className="text-sm text-red-600">
                                            Maksimal 70 karakter tercapai.
                                        </p>
                                    )}
                                    <textarea
                                        maxLength={255}
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        placeholder="Deskripsi"
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                    <div className="text-sm text-gray-500">
                                        {form.description.length}/{maxLength} karakter
                                    </div>
                                    {form.description.length >= maxLength && (
                                        <p className="text-sm text-red-600">
                                            Maksimal 255 karakter tercapai.
                                        </p>
                                    )}

                                    <input type="date" name="event_date" value={form.event_date} onChange={handleChange} className="w-full p-2 border rounded" required />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                                        required={!editingId}
                                    />

                                    <div className="flex justify-end gap-2">
                                        <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 active:scale-95 transition-transform duration-100">Batal</button>
                                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 active:scale-95 transition-transform duration-100">{editingId ? 'Ubah' : 'Tambahkan'}</button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>

                    </div>
                </Dialog>
            </Transition>

            <Transition appear show={isDeleteOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeDeleteModal}>

                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl">
                                <Dialog.Title className="text-lg font-semibold">Apakah anda yakin?</Dialog.Title>
                                <p className="mt-2 text-sm text-gray-500">Tindakan ini tidak dapat dibatalkan.</p>
                                <div className="mt-4 flex justify-end gap-2">
                                    <button onClick={closeDeleteModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 active:scale-95 transition-transform duration-100">Batal</button>
                                    <button onClick={handleDeleteConfirm} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 active:scale-95 transition-transform duration-100">Hapus</button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
