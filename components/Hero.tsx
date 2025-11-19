import React from 'react';

interface HeroProps {
  title: string;
  subtitle: string;
  imageSeed: string;
  overlayColor?: string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, imageSeed }) => {
  // Using picsum seed to generate consistent images based on subject
  const imageUrl = `https://picsum.photos/seed/${imageSeed}/1200/600`;

  return (
    <div className="relative h-48 sm:h-64 md:h-80 w-full overflow-hidden">
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-uganda-dark/90 to-uganda-green/40 mix-blend-multiply"></div>
      <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 shadow-sm">
          {title}
        </h1>
        <p className="text-lg text-uganda-light font-medium max-w-2xl drop-shadow-sm">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default Hero;