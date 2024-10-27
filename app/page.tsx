import RootLayout from "@/components/root-layout";

const HomePage: React.FC = () => {
  return (
    <RootLayout>
      <p>
        {`Welcome to my little corner of the web. Here you'll find some fun tools I've 
        built as well as various ramblings on technologies
         I've used, and experiences I've had.`}
      </p>
    </RootLayout>
  );
};
export default HomePage;
