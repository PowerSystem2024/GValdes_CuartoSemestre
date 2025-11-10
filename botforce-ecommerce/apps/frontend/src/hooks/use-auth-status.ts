"use client";

import { useEffect, useState } from "react";
import { getMe } from "@/services/auth";
import type { User } from "@/types/auth";

export function useAuthStatus() {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = localStorage.getItem("botforce_token");
        setToken(t);
        if (!t) { setLoading(false); return; }
        getMe(t)
            .then(setUser)
            .catch(() => { setUser(null); })
            .finally(() => setLoading(false));
    }, []);

    return { user, token, loading };
}
