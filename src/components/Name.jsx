'use client'

import { useQuery } from "@apollo/client";
import { GET_USERNAME } from "../queries";
const Name = () => {
    const { data, loading, error } = useQuery(GET_USERNAME);

    if (loading) return <p>Laster...</p>;
    if (error) return <p>Noe gikk galt: {error.message}</p>;

    return <h1 className="text-3xl" >Hei, {data?.viewer?.name || "Ukjent bruker"}!</h1>;
}

export default Name;