import Link from "next/link";

const HomePage: React.FC = () => {
  return (
    <div className="max-w-2xl m-auto text-md py-6 flex flex-col gap-4 items-center">
      <h1 className="text-3xl">{`Gabe O'Leary`}</h1>

      <ul className="text-blue-600 flex flex-row gap-3 m-auto items-center justify-center">
        <li>
          <Link className="hover:text-blue-500" href="/about">
            About
          </Link>
        </li>
        <li>
          <Link className="hover:text-blue-500" href="/posts">
            Posts
          </Link>
        </li>
        <li>
          <Link className="hover:text-blue-500" href="/current-map">
            PNW Current Map
          </Link>
        </li>
        <li>
          <Link className="hover:text-blue-500" href="/lake-stats">
            Seattle Lake Stats
          </Link>
        </li>
        {/* <li>
          <Link className="hover:text-blue-500" href="/resume">
            Resume
          </Link>
        </li> */}
      </ul>
      <p>
        {`Welcome to my little corner of the web. Here you'll find some fun tools I've 
        built as well as various ramblings on technologies
         I've used, and experiences I've had.`}
      </p>
    </div>
  );
};
export default HomePage;
