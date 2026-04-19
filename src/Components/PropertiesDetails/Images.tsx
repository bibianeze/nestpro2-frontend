// ---- BACKEND UPDATED: accepts images array instead of single mainImage ----
// ---- BACKEND REMOVED: mainImage single string prop ----
interface ImagesProps {
  images: string[];
}

// ---- placeholder shown when no image is available ----
const Placeholder = ({ className }: { className: string }) => (
  <div className={`${className} bg-[#f3f4f6] border-2 border-dashed border-[#BAB9B9] rounded-xl flex flex-col items-center justify-center gap-2`}>
    <svg className="w-10 h-10 text-[#BAB9B9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    <p className="text-[#BAB9B9] text-[12px]">No image</p>
  </div>
);

const Images = ({ images }: ImagesProps) => {
  // ---- get image at index or null if not available ----
  const getImage = (index: number): string | null => images[index] || null;

  return (
    <div className="flex lg:flex-row flex-col gap-4">

      {/* Main large image */}
      <div className="flex-1">
        {getImage(0) ? (
          <img
            src={getImage(0)!}
            alt="Main Property"
            className="rounded-xl w-full h-full object-cover"
          />
        ) : (
          <Placeholder className="w-full h-full min-h-[300px]" />
        )}
      </div>

      {/* Grid of up to 4 smaller images ---- */}
      <div className="grid grid-cols-2 gap-4 flex-1">
        {[1, 2, 3, 4].map((index) => (
          getImage(index) ? (
            <img
              key={index}
              src={getImage(index)!}
              className="rounded-xl h-[250px] w-full object-cover"
              alt={`Property ${index}`}
            />
          ) : (
            <Placeholder key={index} className="h-[250px] w-full" />
          )
        ))}
      </div>

    </div>
  );
};

export default Images;