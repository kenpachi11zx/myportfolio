import Container from "@/components/Container";
import { useEffect, useRef, Suspense, useState } from "react";
import styles from "@/styles/Home.module.css";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Code2,
  Frame,
  SearchCheck,
  Eye,
  MonitorSmartphone,
  Download,
  Code,
  Database,
  Cloud,
  Terminal,
  FileCode,
  Globe,
  Server,
} from "lucide-react";
import { TriangleDownIcon } from "@radix-ui/react-icons";
import Spline from "@splinetool/react-spline";
import Link from "next/link";
import Script from "next/script";
import { cn, scrollTo } from "@/lib/utils";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import VanillaTilt from "vanilla-tilt";
import { motion } from "framer-motion";

// Component to handle video playback based on focus
function ProjectVideo({ 
  src, 
  isActive, 
  isSectionVisible 
}: { 
  src: string; 
  isActive: boolean;
  isSectionVisible: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Only play if section is visible and this project is active
    if (isSectionVisible && isActive) {
      video.play().catch(() => {
        // Handle autoplay restrictions
      });
    } else {
      video.pause();
      if (!isSectionVisible) {
        video.currentTime = 0; // Reset to start when section is not visible
      }
    }
  }, [isActive, isSectionVisible]);

  // Only load video when section is visible
  if (!isSectionVisible) {
    return (
      <div className="aspect-video h-full w-full rounded-t-md bg-primary/20 flex items-center justify-center">
        <span className="text-muted-foreground text-sm">Loading preview...</span>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      src={src}
      loop
      muted
      playsInline
      preload="metadata"
      className="aspect-video h-full w-full rounded-t-md bg-primary object-cover"
    />
  );
}

const aboutStats = [
  { label: "Years of experience", value: "2+" },
  { label: "Technologies mastered", value: "10+" },
  { label: "Featured projects", value: "5" },
];

const projects = [
  {
    title: "CuraAI — Virtual AI Health Assistant",
    description: "AI Integration / Production-Ready Flask App",
    image: "/assets/curaai.mp4",
    href: "https://curaai-ky7e.onrender.com/",
  },
  {
    title: "Moon Films Portfolio — Video Editing & Visual Storytelling Website",
    description: "Frontend Development / Creative Agency Website",
    image: "/assets/moonfilms.mp4",
    href: "https://moonfilms.netlify.app/",
  },
  {
    title: "GitHub Profile Explorer — Real-Time GitHub Data Viewer",
    description: "Frontend Development / API Integration",
    image: "/assets/github.mp4",
    href: "https://gitfetchprofile.netlify.app/",
  },
  {
    title: "Personal Portfolio — Developer Portfolio Website",
    description: "Frontend Development / Modern Web Technologies",
    image: "/assets/sahil.mp4",
    href: "https://devxfolio.netlify.app/",
  },
  {
    title: "IOCL HSE Compliance Portal — Enterprise Compliance System",
    description: "Enterprise Development / ASP.NET Core MVC",
    image: "/assets/iocl.mp4",
    href: "https://github.com/kenpachi11zx/IOCLCompliancePortalV1.2",
  },
];

const services = [
  {
    service: "Full Stack Development",
    description:
      "Building end-to-end web applications using .NET Core, React, Python, and modern frameworks.",
    icon: Code2,
  },
  {
    service: "Enterprise Applications",
    description:
      "Developing scalable enterprise solutions with ASP.NET Core MVC and Entity Framework Core.",
    icon: Frame,
  },
  {
    service: "AI Integration",
    description:
      "Integrating AI capabilities using OpenAI APIs to enhance applications with intelligent features.",
    icon: SearchCheck,
  },
  {
    service: "Backend Development",
    description:
      "Creating robust REST APIs, web services, and server-side logic with Flask and .NET Core.",
    icon: MonitorSmartphone,
  },
  {
    service: "Database Design",
    description:
      "Designing and implementing efficient database solutions using Microsoft SQL Server.",
    icon: Eye,
  },
];

export default function Home() {
  const refScrollContainer = useRef(null);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const [isProjectsSectionVisible, setIsProjectsSectionVisible] = useState<boolean>(false);
  const projectsSectionRef = useRef<HTMLElement>(null);

  // handle scroll
  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    async function getLocomotive() {
      const Locomotive = (await import("locomotive-scroll")).default;
      new Locomotive({
        el: refScrollContainer.current ?? new HTMLElement(),
        smooth: true,
      });
    }

    function handleScroll() {
      let current = "";
      setIsScrolled(window.scrollY > 0);

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 250) {
          current = section.getAttribute("id") ?? "";
        }
      });

      navLinks.forEach((li) => {
        li.classList.remove("nav-active");

        if (li.getAttribute("href") === `#${current}`) {
          li.classList.add("nav-active");
          console.log(li.getAttribute("href"));
        }
      });
    }

    void getLocomotive();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!carouselApi) return;

    setCount(carouselApi.scrollSnapList().length);
    setCurrent(carouselApi.selectedScrollSnap() + 1);

    let rafId: number | null = null;

    const updateProgress = () => {
      if (rafId) return;
      
      rafId = requestAnimationFrame(() => {
        try {
          // Calculate progress based on scroll position
          const selectedIndex = carouselApi.selectedScrollSnap();
          const totalSlides = carouselApi.scrollSnapList().length;
          const progress = totalSlides > 1 ? selectedIndex / (totalSlides - 1) : 0;
          setScrollProgress(progress);
        } catch {
          setScrollProgress(0);
        }
        rafId = null;
      });
    };

    const updateCurrent = () => {
      setCurrent(carouselApi.selectedScrollSnap() + 1);
      updateProgress();
    };

    carouselApi.on("select", updateCurrent);
    carouselApi.on("scroll", updateProgress);
    updateProgress();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      carouselApi.off("select", updateCurrent);
      carouselApi.off("scroll", updateProgress);
    };
  }, [carouselApi]);

  // Detect when projects section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsProjectsSectionVisible(true);
          } else {
            setIsProjectsSectionVisible(false);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of section is visible
      }
    );

    const section = projectsSectionRef.current;
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  // card hover effect
  useEffect(() => {
    const tilt: HTMLElement[] = Array.from(document.querySelectorAll("#tilt"));
    VanillaTilt.init(tilt, {
      speed: 300,
      glare: true,
      "max-glare": 0.1,
      gyroscope: true,
      perspective: 900,
      scale: 0.9,
    });
  }, []);

  return (
    <Container>
      <Script type="module" src="https://unpkg.com/@splinetool/viewer@1.11.2/build/spline-viewer.js" strategy="afterInteractive" />
      <div ref={refScrollContainer}>
        <Gradient />

        {/* Intro */}
        <section
          id="home"
          data-scroll-section
          className="mt-24 flex w-full flex-col items-center sm:mt-28 xl:mt-0 xl:min-h-screen xl:flex-row xl:justify-between"
        >
          <div className={styles.intro}>
            <div
              data-scroll
              data-scroll-direction="horizontal"
              data-scroll-speed=".09"
              className="flex flex-row items-center space-x-1.5"
            >
              <span className={styles.pill}>.NET Core</span>
              <span className={styles.pill}>React</span>
              <span className={styles.pill}>Python</span>
            </div>
            <div>
              <h1
                data-scroll
                data-scroll-enable-touch-speed
                data-scroll-speed=".06"
                data-scroll-direction="horizontal"
              >
                <span className="text-6xl tracking-tighter text-foreground 2xl:text-8xl">
                  Hello, I&apos;m
                  <br />
                </span>
                <span className="clash-grotesk text-gradient text-6xl 2xl:text-8xl">
                  Sahil Islam.
                </span>
              </h1>
              <p
                data-scroll
                data-scroll-enable-touch-speed
                data-scroll-speed=".06"
                className="mt-1 max-w-lg tracking-tight text-muted-foreground 2xl:text-xl"
              >
                A Full Stack developer based in Guwahati focused on creating interactive digital experiences on the web.
              </p>
            </div>
            <span
              data-scroll
              data-scroll-enable-touch-speed
              data-scroll-speed=".06"
              className="flex flex-row flex-wrap items-center gap-3 pt-6"
            >
              <Link href="mailto:sahilislam619@gmail.com" passHref>
                <Button>
                  Get in touch <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <a
                href="/RESUME.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  View Resume
                </Button>
              </a>
              <Button
                variant="outline"
                onClick={() => scrollTo(document.querySelector("#about"))}
              >
                Learn more
              </Button>
            </span>

            <div
              className={cn(
                styles.scroll,
                isScrolled && styles["scroll--hidden"],
              )}
            >
              Scroll to discover{" "}
              <TriangleDownIcon className="mt-1 animate-bounce" />
            </div>
          </div>
          <div
            data-scroll
            data-scroll-speed="-.01"
            id={styles["canvas-container"]}
            className="mt-8 w-full sm:mt-12 xl:mt-0"
          >
            <Suspense fallback={<span>Loading...</span>}>
              <spline-viewer
                className="h-full w-full"
                url="https://prod.spline.design/wl-j-EKCjvGy8Dil/scene.splinecode"
              />
            </Suspense>
          </div>
        </section>

        {/* About */}
        <section id="about" data-scroll-section>
            <div
              data-scroll
              data-scroll-speed=".4"
              data-scroll-position="top"
              className="my-12 sm:my-16 xl:my-20 flex max-w-6xl flex-col justify-start space-y-8 sm:space-y-10"
            >
            <div className="py-12 sm:py-14 xl:py-16 pb-2 space-y-5 sm:space-y-6 xl:space-y-7">
              <h2 className="text-3xl font-light leading-normal tracking-tighter text-foreground xl:text-[40px]">
                I am a Full Stack developer based in Guwahati focused on creating interactive digital experiences on the web.
              </h2>
              
              <p className="text-base sm:text-lg leading-relaxed tracking-tight text-muted-foreground xl:text-xl">
                I work with technologies such as{" "}
                <Link
                  href="https://dotnet.microsoft.com/"
                  target="_blank"
                  className="underline hover:text-primary transition-colors"
                >
                  .NET Core
                </Link>
                ,{" "}
                <Link
                  href="https://react.dev/"
                  target="_blank"
                  className="underline hover:text-primary transition-colors"
                >
                  React
                </Link>
                ,{" "}
                <Link
                  href="https://www.python.org/"
                  target="_blank"
                  className="underline hover:text-primary transition-colors"
                >
                  Python
                </Link>
                ,{" "}
                <Link
                  href="https://aws.amazon.com/"
                  target="_blank"
                  className="underline hover:text-primary transition-colors"
                >
                  AWS
                </Link>
                ,{" "}
                
                , and{" "}
                <Link
                  href="https://www.microsoft.com/en-us/sql-server"
                  target="_blank"
                  className="underline hover:text-primary transition-colors"
                >
                  SQL Server
                </Link>
                
                {" "}amongst others to achieve this.
              </p>

              <p className="text-lg leading-relaxed tracking-tight text-muted-foreground xl:text-xl">
                Currently pursuing <span className="text-foreground font-medium">Bachelor of Technology in Computer Science & Engineering</span> at The Assam Kaziranga University (2022-2026).
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 xl:grid-cols-3">
              {aboutStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center text-center xl:items-start xl:text-start"
                >
                  <span className="clash-grotesk text-gradient text-4xl font-semibold tracking-tight xl:text-6xl">
                    {stat.value}
                  </span>
                  <span className="tracking-tight text-muted-foreground xl:text-lg">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" data-scroll-section>
          <div
            data-scroll
            data-scroll-speed=".4"
            data-scroll-position="top"
            className="my-20 sm:my-28 xl:my-36 flex max-w-6xl flex-col justify-start space-y-8 sm:space-y-10"
          >
            <div>
              <span className="text-gradient clash-grotesk text-sm font-semibold tracking-tighter">
                ⚡ Skills & Technologies
              </span>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight tracking-tighter xl:text-6xl">
                Technologies I work with.
              </h2>
              <p className="mt-1.5 text-base tracking-tight text-muted-foreground xl:text-lg">
                A comprehensive overview of the languages, frameworks, and tools I use to build modern applications.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mt-12">
              {/* Languages */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Code className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold tracking-tight">Languages</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {["C#", "Python", "JavaScript", "HTML", "CSS"].map((lang) => (
                    <motion.div
                      key={lang}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all duration-300 cursor-default"
                    >
                      <span className="text-sm font-medium">{lang}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Frameworks & Libraries */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FileCode className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold tracking-tight">Frameworks & Libraries</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {[".NET Core", "React", "Flask", "BeautifulSoup", "Tailwind CSS"].map((framework) => (
                    <motion.div
                      key={framework}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all duration-300 cursor-default"
                    >
                      <span className="text-sm font-medium">{framework}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Database */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Database className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold tracking-tight">Database</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {["MySQL", "Microsoft SQL Server"].map((db) => (
                    <motion.div
                      key={db}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all duration-300 cursor-default"
                    >
                      <span className="text-sm font-medium">{db}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Platforms & Tools */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Server className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold tracking-tight">Platforms & Tools</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {["Git", "GitHub", "Visual Studio", "AWS"].map((tool) => (
                    <motion.div
                      key={tool}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all duration-300 cursor-default"
                    >
                      <span className="text-sm font-medium">{tool}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" ref={projectsSectionRef} data-scroll-section>
          {/* Gradient */}
          <div className="relative isolate -z-10">
            <div
              className="absolute inset-x-0 -top-40 transform-gpu overflow-hidden blur-[100px] sm:-top-80 lg:-top-60"
              aria-hidden="true"
            >
              <div
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary via-primary to-secondary opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div>
          </div>
          <div data-scroll data-scroll-speed=".4" className="my-20 sm:my-28 xl:my-36">
            <span className="text-gradient clash-grotesk text-sm font-semibold tracking-tighter">
              ✨ Projects
            </span>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight tracking-tighter xl:text-6xl">
              Featured Projects.
            </h2>
            <p className="mt-1.5 text-base tracking-tight text-muted-foreground xl:text-lg">
              I&apos;ve worked on a variety of projects, from enterprise applications to AI-powered solutions. Here are some of my featured projects:
            </p>

            {/* Carousel */}
            <div className="mt-14">
              <Carousel 
                setApi={setCarouselApi} 
                className="w-full"
                opts={{
                  align: "center",
                  loop: false,
                  duration: 25,
                  slidesToScroll: 1,
                }}
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {projects.map((project, index) => {
                    const activeIndex = current - 1;
                    const isActive = index === activeIndex;
                    const isAdjacent = Math.abs(activeIndex - index) === 1;
                    
                    return (
                      <CarouselItem 
                        key={project.title} 
                        className="pl-2 md:pl-4 basis-[90%] md:basis-[75%] lg:basis-[65%]"
                      >
                        <div
                          className={cn(
                            "transition-all duration-500 ease-out",
                            isActive 
                              ? "scale-100 opacity-100 z-20" 
                              : isAdjacent 
                              ? "scale-95 opacity-70 z-10" 
                              : "scale-85 opacity-50 z-0"
                          )}
                        >
                          <Card id="tilt" className="relative overflow-hidden">
                            {!isActive && (
                              <div 
                                className={cn(
                                  "absolute inset-0 z-10 rounded-md transition-opacity duration-500",
                                  isAdjacent ? "bg-black/40" : "bg-black/50"
                                )}
                              />
                            )}
                            <CardHeader className="p-0">
                              {project.href.startsWith("http") ? (
                                <a
                                  href={project.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block"
                                >
                                  {project.image.match(/\.(webm|mp4|mov)$/i) ? (
                                    <ProjectVideo 
                                      src={project.image} 
                                      isActive={isActive}
                                      isSectionVisible={isProjectsSectionVisible}
                                    />
                                  ) : (
                                    <Image
                                      src={project.image}
                                      alt={project.title}
                                      width={600}
                                      height={300}
                                      quality={100}
                                      className="aspect-video h-full w-full rounded-t-md bg-primary object-cover"
                                    />
                                  )}
                                </a>
                              ) : (
                                <Link href={project.href} target="_blank" passHref>
                                  {project.image.match(/\.(webm|mp4|mov)$/i) ? (
                                    <ProjectVideo 
                                      src={project.image} 
                                      isActive={isActive}
                                      isSectionVisible={isProjectsSectionVisible}
                                    />
                                  ) : (
                                    <Image
                                      src={project.image}
                                      alt={project.title}
                                      width={600}
                                      height={300}
                                      quality={100}
                                      className="aspect-video h-full w-full rounded-t-md bg-primary object-cover"
                                    />
                                  )}
                                </Link>
                              )}
                            </CardHeader>
                            <CardContent className="absolute bottom-0 w-full bg-background/50 backdrop-blur">
                              <CardTitle className="border-t border-white/5 p-4 text-base font-normal tracking-tighter">
                                {project.description}
                              </CardTitle>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className="left-2 sm:left-4 md:-left-12" />
                <CarouselNext className="right-2 sm:right-4 md:-right-12" />
              </Carousel>
              
              {/* Custom Scrollbar */}
              <div className="mt-4 w-full">
                <div
                  ref={scrollbarRef}
                  className="group relative h-0.5 w-full cursor-pointer rounded-full bg-muted/10 transition-all duration-200 hover:h-1 hover:bg-muted/20"
                  onMouseDown={(e) => {
                    if (!carouselApi || !scrollbarRef.current) return;
                    e.preventDefault();
                    setIsDragging(true);
                    
                    const handleMouseMove = (moveEvent: MouseEvent) => {
                      const rect = scrollbarRef.current!.getBoundingClientRect();
                      const x = moveEvent.clientX - rect.left;
                      const percentage = Math.max(0, Math.min(1, x / rect.width));
                      const scrollToIndex = Math.round(percentage * (count - 1));
                      carouselApi.scrollTo(scrollToIndex);
                    };

                    const handleMouseUp = () => {
                      setIsDragging(false);
                      document.removeEventListener("mousemove", handleMouseMove);
                      document.removeEventListener("mouseup", handleMouseUp);
                    };

                    handleMouseMove(e.nativeEvent);
                    document.addEventListener("mousemove", handleMouseMove);
                    document.addEventListener("mouseup", handleMouseUp);
                  }}
                  onClick={(e) => {
                    if (!carouselApi || isDragging) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const percentage = Math.max(0, Math.min(1, x / rect.width));
                    const scrollToIndex = Math.round(percentage * (count - 1));
                    carouselApi.scrollTo(scrollToIndex);
                  }}
                >
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all duration-150 ease-out"
                    style={{
                      width: `${Math.max(0, Math.min(100, scrollProgress * 100))}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-4 text-center text-sm text-muted-foreground">
                <span className="font-semibold">
                  {current} / {count}
                </span>{" "}
                projects
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" data-scroll-section>
          <div
            data-scroll
            data-scroll-speed=".4"
            data-scroll-position="top"
            className="my-16 sm:my-24 xl:my-32 flex flex-col justify-start space-y-8 sm:space-y-10"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 1,
                staggerChildren: 0.5,
              }}
              viewport={{ once: true }}
              className="grid items-center gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3"
            >
              <div className="flex flex-col py-4 sm:py-6 xl:p-6">
                <h2 className="text-2xl sm:text-3xl xl:text-4xl font-medium tracking-tight">
                  Need more info?
                  <br />
                  <span className="text-gradient clash-grotesk tracking-normal">
                    I got you.
                  </span>
                </h2>
                <p className="mt-1.5 sm:mt-2 text-sm sm:text-base tracking-tighter text-secondary-foreground">
                  Here are some of the services I offer. If you have any
                  questions, feel free to reach out.
                </p>
              </div>
              {services.map((service) => (
                  <div
                    key={service.service}
                    className="flex flex-col items-start rounded-md bg-white/5 p-6 sm:p-8 md:p-10 xl:p-14 shadow-md backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-md"
                  >
                    <service.icon className="my-3 sm:my-4 xl:my-6 text-primary" size={18} />
                  <span className="text-base sm:text-lg tracking-tight text-foreground">
                    {service.service}
                  </span>
                  <span className="mt-1.5 sm:mt-2 text-sm sm:text-base tracking-tighter text-muted-foreground">
                    {service.description}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" data-scroll-section className="my-24 sm:my-32 xl:my-40">
          <div
            data-scroll
            data-scroll-speed=".4"
            data-scroll-position="top"
            className="flex flex-col items-center justify-center rounded-lg bg-gradient-to-br from-primary/[6.5%] to-white/5 px-8 py-16 text-center xl:py-24"
          >
            <h2 className="text-4xl font-medium tracking-tighter xl:text-6xl">
              Let&apos;s work{" "}
              <span className="text-gradient clash-grotesk">together.</span>
            </h2>
            <p className="mt-1.5 text-base tracking-tight text-muted-foreground xl:text-lg">
              Got a question, proposal or project or want to work together on something? Feel free to reach out.
            </p>
            <Link href="mailto:sahilislam619@gmail.com" passHref>
              <Button className="mt-6">Get in touch</Button>
            </Link>
          </div>
        </section>
      </div>
    </Container>
  );
}

function Gradient() {
  return (
    <>
      {/* Upper gradient */}
      <div className="absolute -top-40 right-0 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <svg
          className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
          viewBox="0 0 1155 678"
        >
          <path
            fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
            fillOpacity=".1"
            d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
          />
          <defs>
            <linearGradient
              id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
              x1="1155.49"
              x2="-78.208"
              y1=".177"
              y2="474.645"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#7980fe" />
              <stop offset={1} stopColor="#f0fff7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Lower gradient */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <svg
          className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
          viewBox="0 0 1155 678"
        >
          <path
            fill="url(#ecb5b0c9-546c-4772-8c71-4d3f06d544bc)"
            fillOpacity=".1"
            d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
          />
          <defs>
            <linearGradient
              id="ecb5b0c9-546c-4772-8c71-4d3f06d544bc"
              x1="1155.49"
              x2="-78.208"
              y1=".177"
              y2="474.645"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#9A70FF" />
              <stop offset={1} stopColor="#838aff" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </>
  );
}
