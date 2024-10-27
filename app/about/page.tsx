/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import React from "react";

const About: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <Image
        src="/me.avif"
        alt="a photo of Gabe O'Leary"
        width={600}
        height={600}
      />
      <h1 className="text-2xl font-bold">How I got to where I am</h1>
      <div className="max-w-2xl m-auto text-md py-6 flex flex-col gap-4 items-center">
        {/* TODO: better quality photo */}

        <p>
          As long as I can remember I've had an innate curiosity about how
          things work. At first this manifested in dismantling any and all
          electronics I could get my hands on in order to take a look inside.
          You name it, coffee makers, vacuum cleaners, computers, they were all
          at risk of being broken down into their various components when I was
          around. Over time this morphed into wanting to fix things and even
          build my own devices. For a time in middle & high school I ran a
          computer repair & assembling business, and even ended up teaching a
          computer construction class at my school.
        </p>

        <p>
          I attended the University of Michigan for undergrad and obviously
          ended up in the engineering school. I had a limited background with
          computer programming and it wasn't until I took the intro to
          programming class required of all engineering students that I realized
          how much I liked it. In addition to majoring in Computer Science I
          obtained a Minor in Economics and a certificate in Entrepreneurship.
        </p>

        <p>
          After graduation I got a job at Microsoft and worked on a variety of
          products from Azure to Bing Ads (known as Microsoft Advertising these
          days) and a consumer facing product called the{" "}
          <a
            href="https://www.microsoft.com/en-us/garage/profiles/personal-shopping-assistant/"
            className="underline"
          >
            Microsoft Shopping Assistant
          </a>
          .
        </p>

        <p>
          Six years after my first day at Microsoft I decided to quest out on my
          own to pursue a few ideas for consumer solutions & applications which
          eventually turned into some contract & full time positions at early
          stage startups.
        </p>

        <p>
          I'm also a lover of all things outdoors. Growing up my parents took my
          brother and me on hikes and backpacking trips around the Appalachians
          & the Tetons. It wasn't until I spent my first summer on the West
          Coast, Seattle to be specific, that I really felt a spark for all
          things outdoors. During my first tenure as an intern at Microsoft, I
          went hiking every single weekend, and made a trip to Yosemite with my
          brother at the end of the summer. When I came back for another summer
          I bought a pair of crampons & and ice axe and got my first taste of
          climbing and summiting peaks. Soon after I took a Mountaineering
          course on a four month stint in South America & returned to climb all
          of the Washington Volcanoes (including Mount Rainier). These days I do
          a lot of rock climbing whenever it's dry and backcountry skiing during
          the winter. I ran the{" "}
          <a
            href="https://sites.google.com/view/wacbcclass"
            className="underline"
          >
            Washington Alpine Club's Backcountry Ski Class
          </a>{" "}
          from 2018 - 2021.
        </p>
      </div>
    </div>
  );
};

export default About;
