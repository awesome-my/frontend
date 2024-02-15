"use client";

import useSWR from "swr";
import { fetchProjects } from "@/app/lib/http/project";
import { TransitionWrapper } from "@/app/components/TransitionWrapper";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ProjectCard } from "@/app/dashboard/projects/ProjectCard";

export default function Projects() {
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const [page, setPage] = useState(1);
    const { data } = useSWR(`/client/projects?page=${page}&limit=12`, () => fetchProjects(page, 12));
    
    useEffect(() => {
        setPage(parseInt(searchParams.get("page") ?? "1"));
    }, [searchParams, pathName]);

    return (
        <main className="max-w-6xl mx-auto px-8 flex py-8 flex-col justify-center">
            <TransitionWrapper key={page}>
                <h2 className="font-cal-sans text-4xl md:text-5xl text-white tracking-wider mb-4">
                    Projects
                </h2>
                {!data ? "Loading..." : data.projects.length === 0 ? "No projects here... yet" : (
                    <>
                        <div className="grid md:grid-cols-3 gap-4">
                            {data.projects.map((project, ix) => (
                                <ProjectCard project={project} key={ix} />
                            ))}
                        </div>
                        <div className="mt-4 flex flex-row justify-between items-center">
                            <p className="text-white/50">
                                You are viewing {data.pagination.currentPage} out of {data.pagination.totalPages} pages.
                            </p>
                            <div className="flex flex-row gap-6">
                                {page > 1 &&
                                    <Link href={`/dashboard/projects?page=${page - 1}`} className="transition duration-500 ease-in-out text-white/50 hover:text-white/70 flex flex-row gap-2 items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18">
                                            </path>
                                        </svg>
                                        Previous
                                    </Link>
                                }
                                {page < data.pagination.totalPages &&
                                    <Link href={`/dashboard/projects?page=${page + 1}`} className="transition duration-500 ease-in-out text-white/50 hover:text-white/70 flex flex-row gap-2 items-center">
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