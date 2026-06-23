"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { upsertUserProgress } from "@/actions/user-progress";

import type { Course, UserProgress } from "@/db/schema";
import { Card } from "./card";

type ListProps = {
  courses: Course[];
  activeCourseId?: UserProgress["activeCourseId"];
};

export const List = ({ courses, activeCourseId }: ListProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onClick = (id: number) => {
    if (pending) return;

    if (id === activeCourseId) {
      router.push("/learn");
      return;
    }

    startTransition(() => {
      upsertUserProgress(id)
        .then((result) => {
          if (result?.redirect) router.push(result.redirect);
        })
        .catch(() => toast.error("Something went wrong."));
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4 pt-6 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))]">
      {courses.map((course) => (
        <Card
          key={course.id}
          id={course.id}
          title={course.title}
          imageSrc={course.imageSrc}
          onClick={onClick}
          disabled={pending}
          isActive={course.id === activeCourseId}
        />
      ))}
    </div>
  );
};
