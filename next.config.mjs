/** @type {import('next').NextConfig} */
const nextConfig = {

    images:{
        domains: ['res.cloudinary.com'], // Agrega el dominio de Cloudinary
    },
    typescript: {
        // Habilitar esta opción para desactivar la validación de tipos
        ignoreBuildErrors: true,
      },
};

export default nextConfig;
