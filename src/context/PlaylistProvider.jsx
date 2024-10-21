"use client";

import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { setTracks } from "@/store/slices/tracks";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const PlaylistProvider = ({ children }) => {
    const dispatch = useDispatch();
    const [playlist, setPlaylist] = useState([]);

    const AUDIUS_API_HOST = "https://discovery-us-01.audius.openplayer.org";

    useEffect(() => {
        fetchTrendingTracks();
    }, []);

    useEffect(() => {
        dispatch(setTracks(playlist));
    }, [playlist, dispatch]);

    const fetchTrendingTracks = async (appName = "MusicBox", time = "week", limit = 10) => {
        try {
            // Fetch trending tracks
            const response = await fetch(
                `${AUDIUS_API_HOST}/v1/tracks/trending?app_name=${appName}&time=${time}&limit=${limit}`
            );

            if (!response.ok) {
                throw new Error(`API request failed with status: ${response.status}`);
            }

            const data = await response.json();
            if (!data || !data.data || !Array.isArray(data.data)) {
                throw new Error("Invalid response format. No data found.");
            }

            setPlaylist(data.data);
            toast.success("Trending tracks fetched successfully!", 1);
        } catch (error) {
            toast.error(`Error fetching trending tracks: ${error.message || error}`);
        }
    };

    return (
        <>
            {children}
            <ToastContainer />
        </>
    );
    };

export default PlaylistProvider;
