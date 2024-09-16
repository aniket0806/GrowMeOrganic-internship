import axios from 'axios';
import { useState, useEffect } from 'react';

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

const ProductService = (page: number) => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>(0); 
  useEffect(() => {
    const fetchArtworks = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${page}`);
        const data = response.data.data;
        const pagination = response.data.pagination;
        console.log("response",data)
        const formattedArtworks = data.map((artwork: any) => ({
          id: artwork.id,
          title: artwork.title,
          place_of_origin: artwork.place_of_origin,
          artist_display: artwork.artist_display,
          inscriptions: artwork.inscriptions || 'N/A',
          date_start: artwork.date_start,
          date_end: artwork.date_end,
        }));

        setArtworks(formattedArtworks);
        setTotalRecords(pagination.total); 
      } catch (err) {
        setError('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [page]); 
  return { artworks, loading, error, totalRecords };
};

export default ProductService;
