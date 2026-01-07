"use client";

import { motion } from "framer-motion";
import { BookOpen, Users, LogIn, Library, Search, BarChart3, Star, BookCopy } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-stone-200 bg-stone-50/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
              <Library className="h-5 w-5" />
            </div>
            <div className="text-xl font-bold tracking-tight text-stone-900">BukuGo</div>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-all hover:border-indigo-200 hover:text-indigo-600 hover:shadow-sm">
            <LogIn className="h-4 w-4" />
            Log In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-32 lg:pb-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600">
                  <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2 animate-pulse"></span>
                  v2.0 is now live
                </div>
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl md:text-6xl">
                  The modern way to manage your <span className="text-indigo-600">library.</span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-stone-600">
                  Say goodbye to spreadsheets and clunky software. BukuGo is the breezy, modern CMS designed for community libraries, schools, and private collections.
                </p>
                <div className="mt-8 flex items-center justify-center gap-x-6 lg:justify-start">
                  <button className="rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 hover:shadow-indigo-200 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Get Started for Free
                  </button>
                  <a href="#features" className="text-sm font-semibold leading-6 text-stone-900 hover:text-indigo-600 transition-colors">
                    Learn more <span aria-hidden="true">→</span>
                  </a>
                </div>
                
                {/* Mini Social Proof */}
                <div className="mt-10 flex items-center justify-center gap-4 lg:justify-start">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-8 w-8 rounded-full border-2 border-white bg-indigo-${i * 100 + 100}`} />
                    ))}
                  </div>
                  <p className="text-sm text-stone-500">Trusted by 500+ libraries</p>
                </div>
              </motion.div>
            </div>
            
            {/* Abstract Visual - "Digital Library" */}
            <div className="relative mt-12 sm:mx-auto sm:max-w-lg lg:col-span-6 lg:mx-0 lg:mt-0 lg:flex lg:max-w-none lg:items-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative mx-auto w-full max-w-[500px] lg:max-w-none"
              >
                {/* Decorative blobs */}
                <div className="absolute -top-12 -right-12 -z-10 h-[300px] w-[300px] rounded-full bg-indigo-100/50 blur-3xl"></div>
                <div className="absolute -bottom-12 -left-12 -z-10 h-[300px] w-[300px] rounded-full bg-blue-100/50 blur-3xl"></div>
                
                {/* "App Interface" Mockup */}
                <div className="relative rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-stone-900/10">
                  <div className="rounded-xl bg-stone-50 p-6">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                      <div className="h-4 w-24 rounded bg-stone-200"></div>
                      <div className="flex gap-2">
                        <div className="h-8 w-8 rounded-full bg-indigo-100"></div>
                        <div className="h-8 w-8 rounded-full bg-stone-200"></div>
                      </div>
                    </div>
                    {/* Stats Row */}
                    <div className="mb-6 grid grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-stone-900/5">
                          <div className="mb-2 h-8 w-8 rounded-md bg-indigo-50"></div>
                          <div className="h-3 w-16 rounded bg-stone-200"></div>
                        </div>
                      ))}
                    </div>
                    {/* "Book List" */}
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center gap-4 rounded-lg bg-white p-3 shadow-sm ring-1 ring-stone-900/5">
                          <div className="h-10 w-8 rounded bg-stone-800"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-3 w-3/4 rounded bg-stone-200"></div>
                            <div className="h-2 w-1/2 rounded bg-stone-100"></div>
                          </div>
                          <div className="h-6 w-16 rounded-full bg-green-50"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-indigo-900 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
            <div className="flex flex-col items-center gap-2">
              <div className="text-4xl font-bold tracking-tight text-white">50k+</div>
              <div className="text-sm font-medium text-indigo-200">Books Cataloged</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="text-4xl font-bold tracking-tight text-white">12k+</div>
              <div className="text-sm font-medium text-indigo-200">Active Readers</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="text-4xl font-bold tracking-tight text-white">99.9%</div>
              <div className="text-sm font-medium text-indigo-200">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Features</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              Everything your library needs
            </p>
            <p className="mt-6 text-lg leading-8 text-stone-600">
              We&apos;ve distilled library management down to the essentials. Powerful enough for collections of thousands, simple enough for a team of one.
            </p>
          </div>
          
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-3">
            {[
              {
                title: "Smart Cataloging",
                desc: "Scan an ISBN and we'll fill in the details. Cover art, author, publisher—it's all automatic.",
                icon: BookOpen,
              },
              {
                title: "Circulation Desk",
                desc: "Check books in and out in seconds. Automated email reminders for overdue items.",
                icon: BookCopy,
              },
              {
                title: "Member Management",
                desc: "Digital library cards for your members. Track reading history and manage fines easily.",
                icon: Users,
              },
              {
                title: "Search & Discovery",
                desc: "A beautiful public-facing catalog for your members to browse your collection from home.",
                icon: Search,
              },
              {
                title: "Analytics & Reports",
                desc: "Understand what your community is reading. Visualize circulation trends over time.",
                icon: BarChart3,
              },
              {
                title: "Community Reviews",
                desc: "Let your members rate and review books to build a thriving community of readers.",
                icon: Star,
              },
            ].map((feature, idx) => (
              <div key={idx} className="group relative flex flex-col rounded-2xl border border-stone-200 bg-stone-50 p-8 transition-all hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-white ring-1 ring-stone-900/5 transition-colors group-hover:bg-indigo-600">
                  <feature.icon className="h-6 w-6 text-stone-600 transition-colors group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold leading-8 text-stone-900">{feature.title}</h3>
                <p className="mt-2 text-base leading-7 text-stone-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-stone-100 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-4xl">
            <figure className="mt-10">
              <blockquote className="text-center text-xl font-semibold leading-8 text-stone-900 sm:text-2xl sm:leading-9">
                <p>
                  “BukuGo transformed our small community library. We went from messy spreadsheets to a professional catalog in one afternoon. Our volunteers love how simple it is to use.”
                </p>
              </blockquote>
              <figcaption className="mt-10">
                <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                  <div className="font-semibold text-stone-900">Sarah Jenkins</div>
                  <svg viewBox="0 0 2 2" width={3} height={3} aria-hidden="true" className="fill-stone-900">
                    <circle cx={1} cy={1} r={1} />
                  </svg>
                  <div className="text-stone-600">Head Librarian, Westside Community Center</div>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="col-span-1">
              <div className="flex items-center gap-2">
                <Library className="h-6 w-6 text-indigo-600" />
                <span className="text-xl font-bold text-stone-900">BukuGo</span>
              </div>
              <p className="mt-4 text-sm text-stone-500">
                The modern operating system for forward-thinking libraries.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Product</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-sm text-stone-600 hover:text-indigo-600">Features</a></li>
                <li><a href="#" className="text-sm text-stone-600 hover:text-indigo-600">Pricing</a></li>
                <li><a href="#" className="text-sm text-stone-600 hover:text-indigo-600">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Company</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-sm text-stone-600 hover:text-indigo-600">About</a></li>
                <li><a href="#" className="text-sm text-stone-600 hover:text-indigo-600">Careers</a></li>
                <li><a href="#" className="text-sm text-stone-600 hover:text-indigo-600">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-sm text-stone-600 hover:text-indigo-600">Privacy</a></li>
                <li><a href="#" className="text-sm text-stone-600 hover:text-indigo-600">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-stone-100 pt-8">
            <p className="text-center text-sm text-stone-400">
              © {new Date().getFullYear()} BukuGo Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
