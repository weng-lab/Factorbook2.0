/** @type {import('next').NextConfig} */
const nextConfig = {
  //https://nextjs.org/docs/14/app/building-your-application/routing/redirecting#redirects-in-nextconfigjs
  async redirects() {
    return [
      {
        source: '/transcriptionfactor/:species/:factor',
        destination: '/transcriptionfactor/:species/:factor/function',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
