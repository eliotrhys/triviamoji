"use client"

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import GameForm from "../../components/GameForm";

export default function Page()
{
    const [isSuddenDeath, setIsSuddenDeath] = useState(false);
    const searchParams = useSearchParams();
    const isSuddenDeathParam = searchParams.get("isSuddenDeath");

    useEffect(() => {
        if (isSuddenDeathParam === "true") 
        {
            setIsSuddenDeath(true);
        }
        else 
        {
            setIsSuddenDeath(false);
        }
    }, []);

    

    return (
        <div className="w-full">
            <GameForm isSuddenDeath={isSuddenDeath} />
        </div>
    )
}