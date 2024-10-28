import RootLayout from "@/components/root-layout";
import { getSortedWorksData } from "@/lib/posts";
import dayjs from "dayjs";
import Link from "next/link";

const HomePage: React.FC = () => {
  const works = getSortedWorksData();

  return (
    <RootLayout>
      <div className="flex flex-col gap-4">
        <p>
          {`Welcome to my little corner of the web. Here you'll find some fun tools I've 
        built as well as various ramblings on technologies
         I've used, and experiences I've had.`}
        </p>
        <h1 className="text-2xl font-bold">Works</h1>
        <ul className="flex flex-col gap-4">
          {works.map((work) => (
            <li key={work.id}>
              <Link
                href={`/works/${work.id}`}
                className="grid grid-cols-5 group gap-4"
              >
                <sub className="text-sm text-gray-500 text-right col-span-2 md:col-span-1">
                  {dayjs(work.date).format("MMMM YYYY")}
                </sub>
                <div className="col-span-3 md:col-span-4">
                  <h1 className="text-lg font-bold  group-hover:underline text-slate-900">
                    {work.title}
                  </h1>
                  <sub className="text-sm text-gray-500">
                    {work.description}
                  </sub>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </RootLayout>
  );
};
export default HomePage;
