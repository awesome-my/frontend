"use client";

import useSWR from "swr";
import { TransitionWrapper } from "@/app/components/TransitionWrapper";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Spinner } from "@/app/components/Spinner";
import { fetchEvents } from "@/app/lib/http/event";
import { EventCard } from "@/app/events//EventCard";

export default function Page() {
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const [page, setPage] = useState(1);
    const { data } = useSWR(`/public/events?page=${page}&limit=12`, () => fetchEvents(page, 12));
    
    useEffect(() => {
        setPage(parseInt(searchParams.get("page") ?? "1"));
    }, [searchParams, pathName]);

    return (
        <main className="max-w-6xl mx-auto px-8 flex py-24 flex-col justify-center">
            <TransitionWrapper key={page}>
                <Link href="/" className="mb-6 transition duration-500 ease-in-out text-white/50 hover:text-white/70 flex flex-row gap-2 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18">
                        </path>
                    </svg>
                    Home
                </Link>
                <h2 className="font-cal-sans text-4xl md:text-5xl text-white tracking-wider">
                    Events
                </h2>
                <p className="md:text-lg mt-1 tracking-wide mb-4">
                    Dive into the Malaysian tech scene at our dynamic events. Connect with leaders, discover trends, and shape the future. Join us as we explore the next big thing in tech!
                </p>
                {!data ? <Spinner centered /> : data.events.length === 0 ? "No events here... yet" : (
                    <>
                        <div className="grid md:grid-cols-3 gap-4">
                            {data.events.map((event, ix) => (
                                <EventCard event={event} key={ix} />
                            ))}
                        </div>
                        <div className="mt-4 flex flex-row justify-between items-center">
                            <p className="text-white/50">
                                You are viewing {data.pagination.currentPage} out of {data.pagination.totalPages} pages.
                            </p>
                            <div className="flex flex-row gap-6">
                                {page > 1 &&
                                    <Link href={`/events?page=${page - 1}`} className="transition duration-500 ease-in-out text-white/50 hover:text-white/70 flex flex-row gap-2 items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18">
                                            </path>
                                        </svg>
                                        Previous
                                    </Link>
                                }
                                {page < data.pagination.totalPages &&
                                    <Link href={`/events?page=${page + 1}`} className="transition duration-500 ease-in-out text-white/50 hover:text-white/70 flex flex-row gap-2 items-center">
                                        Next
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 0 20 20">
                                            <path fill="currentColor" fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10" clipRule="evenodd">
                                            </path>
                                        </svg>
                                    </Link>
                                }
                            </div>
                        </div>
                    </>
                )}
            </TransitionWrapper>
        </main>
    );
}