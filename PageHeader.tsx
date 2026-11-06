export default function PageHeader({
  kicker,
  title,
  desc,
  image,
  imageAlt = "",
}: {
  kicker: string;
  title: string;
  desc?: string;
  image?: string;
  imageAlt?: string;
}) {
  const text = (
    <>
      <p className="text-sm font-medium tracking-widest text-brocade-rose">
        {kicker}
      </p>
      <h1 className="mt-3 font-serif text-4xl font-black text-indigo-deep-900 sm:text-5xl">
        {title}
      </h1>
      {desc && (
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-600 sm:text-base">
          {desc}
        </p>
      )}
    </>
  );

  return (
    <header className="relative overflow-hidden bg-white">
      {image ? (
        // 有图时：白底页头，竖构图插画完整显示在右侧
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-12 pt-28 sm:px-6 lg:grid-cols-5">
          <div className="text-center lg:col-span-3 lg:text-left">{text}</div>
          <div className="flex justify-center lg:col-span-2 lg:justify-end">
            <img
              src={image}
              alt={imageAlt}
              className="h-[360px] w-auto object-contain object-bottom sm:h-[420px]"
            />
          </div>
        </div>
      ) : (
        // 无图时：白色页头
        <div className="bg-white pb-14 pt-28">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
            <p className="text-sm font-medium tracking-widest text-brocade-rose">
              {kicker}
            </p>
            <h1 className="mt-3 font-serif text-4xl font-black text-indigo-deep-900 sm:text-5xl">
              {title}
            </h1>
            {desc && (
              <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-ink-600 sm:text-base">
                {desc}
              </p>
            )}
          </div>
        </div>
      )}
      <div className="brocade-divider" />
    </header>
  );
}
