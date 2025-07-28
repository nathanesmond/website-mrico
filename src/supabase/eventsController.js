import supabase from './supabaseClient';
export const getUserAndEvents = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { user: null, data: [] };

    const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return { user, data };
};

export const createEvent = async (form) => {
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error("User not authenticated");

    let imageUrl = null;
    console.log("user_id:", user.id);

    if (form.image) {
        const filePath = `uploads/${Date.now()}-${form.image.name}`;
        const { data, error: uploadError } = await supabase
            .storage
            .from('event-images')
            .upload(filePath, form.image, {
                cacheControl: '3600',
                upsert: false,
            });

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase
            .storage
            .from('event-images')
            .getPublicUrl(filePath);

        imageUrl = publicData.publicUrl;
    }

    const eventData = {
        title: form.title,
        description: form.description,
        event_date: form.event_date,
        image_url: imageUrl,
        user_id: user.id,
    };

    console.log("Creating event:", eventData);

    const { error } = await supabase.from('events').insert([eventData]);
    if (error) throw error;
};




export const updateEvent = async (id, form) => {
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error("User not authenticated");

    let imageUrl = null;

    // Step 1: If a new image is uploaded, upload it
    if (form.image) {
        const filePath = `uploads/${Date.now()}-${form.image.name}`;
        const { error: uploadError } = await supabase
            .storage
            .from('event-images')
            .upload(filePath, form.image, {
                cacheControl: '3600',
                upsert: false,
            });

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase
            .storage
            .from('event-images')
            .getPublicUrl(filePath);

        imageUrl = publicData.publicUrl;
    } else {
        // Step 2: If no new image, fetch existing event to reuse current image_url
        const { data: existingEvent, error: fetchError } = await supabase
            .from('events')
            .select('image_url')
            .eq('id', id)
            .single();

        if (fetchError) throw fetchError;

        imageUrl = existingEvent.image_url;
    }

    const updatedData = {
        title: form.title,
        description: form.description,
        event_date: form.event_date,
        image_url: imageUrl,
        user_id: user.id,
    };

    const { error } = await supabase
        .from('events')
        .update(updatedData)
        .eq('id', id);

    if (error) throw error;
};


export const deleteEvent = async (id) => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
};


export const getPublicEvents = async () => {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

    if (error) throw error;
    return data;
};
