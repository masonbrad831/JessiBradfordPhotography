import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function generatePhotos(folder: string, count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${folder}-${i + 1}`,
    title: `Photo ${i + 1}`,
    imageUrl: `/images/${folder}/0${i + 1}.jpg`,
    isActive: true,
  }));
}

const portfolioData = [
  { id: "portraits", title: "Portraits", showOnClient: true, photos: generatePhotos("portrait", 21) },
  { id: "senior", title: "Seniors", showOnClient: true, photos: generatePhotos("senior", 14) },
  { id: "maternity", title: "Maternity", showOnClient: true, photos: generatePhotos("maternity", 5) },
  { id: "family", title: "Family", showOnClient: true, photos: generatePhotos("family", 3) },
  { id: "car", title: "Cars", showOnClient: true, photos: generatePhotos("cars", 8) },
  { id: "boudoir", title: "Boudoir", showOnClient: true, photos: generatePhotos("boudoir", 10) },
  { id: "fall", title: "Fall", showOnClient: true, photos: generatePhotos("fall", 5) },
];

const Portfolio: React.FC = () => {
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const [portfolios] = useState(portfolioData);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  useEffect(() => {
    const allPhotos = portfolioData.flatMap(p => p.photos);
    let loadedCount = 0;

    allPhotos.forEach(photo => {
      const img = new Image();
      img.src = photo.imageUrl;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === allPhotos.length) setAllImagesLoaded(true);
      };
    });

    const visible = portfolioData.filter(p => p.showOnClient !== false);
    setSelectedPortfolioId(visible.length ? visible[0].id : null);
  }, []);

  const visiblePortfolios = portfolios.filter(p => p.showOnClient !== false);
  const selectedPortfolio = portfolios.find(p => p.id === selectedPortfolioId);
  const photos = selectedPortfolio ? selectedPortfolio.photos.filter(photo => photo.isActive) : [];

  return (
    <div className="min-h-screen bg-cream-50">
      <section className="bg-sage-800 text-white py-20">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl font-serif font-bold mb-6">Portfolio</h1>
            <p className="text-xl text-sage-200 max-w-2xl mx-auto">
              Explore my collection of moody, artistic photography capturing life's beautiful moments
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-cream-100">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {visiblePortfolios.length === 0 ? (
              <span className="text-sage-600">No portfolios available.</span>
            ) : (
              visiblePortfolios.map(portfolio => (
                <button
                  key={portfolio.id}
                  onClick={() => setSelectedPortfolioId(portfolio.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedPortfolioId === portfolio.id
                      ? 'bg-sage-600 text-white'
                      : 'bg-sage-100 text-sage-700 hover:bg-sage-200'
                  }`}
                >
                  {portfolio.title}
                </button>
              ))
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {!allImagesLoaded ? (
              <div className="col-span-full text-center text-sage-600">Loading photos…</div>
            ) : !selectedPortfolio || photos.length === 0 ? (
              <div className="col-span-full text-center text-sage-600">No photos found.</div>
            ) : (
              photos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="group relative bg-cream-200 rounded-lg overflow-hidden shadow-lg card-hover"
                >
                  <div className="aspect-[3/4] bg-sage-200 relative overflow-hidden">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;