type AcademyBannerProps = {
  className?: string;
};

export default function AcademyBanner({ className = "" }: AcademyBannerProps) {
  return (
    <img
      src="/academia/studio-training.jpg"
      alt="Estúdio Training Academia"
      className={`mt-1 h-[60px] w-full rounded-lg object-cover ${className}`}
    />
  );
}
