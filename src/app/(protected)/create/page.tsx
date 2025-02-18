"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useRefresh from "@/hooks/use-refresh";
import { api } from "@/trpc/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const createProject = api.project.createProject.useMutation();
  const refetch = useRefresh();

  function onSubmit(data: FormInput) {
    createProject.mutate(
      {
        githubUrl: data.repoUrl,
        name: data.projectName,
        githubToken: data.githubToken,
      },
      {
        onSuccess: () => {
          toast.success("Project created successfully");
          refetch();
        },
        onError: () => {
          toast.error("Failed to create project");
        },
      },
    );
    return true;
  }

  return (
    <div className="flex h-full items-center justify-center gap-12">
      <img src="/undraw_github.svg" className="h-56 w-auto"></img>
      <div className="">
        <div className="">
          <h1 className="text-2xl font-semibold">
            Link your GitHub Repository
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter the URL of your repository to link it to Dionysus
          </p>
        </div>
        <div className="h-4"></div>
        <div className="">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              required
              {...register("projectName", { required: true })}
              placeholder="Project Name"
            />
            <div className="h-2"></div>
            <Input
              required
              {...register("repoUrl", { required: true })}
              placeholder="Github Url"
              type="url"
            />
            <div className="h-2"></div>
            <Input
              {...register("githubToken")}
              placeholder="Github Token (optional)"
            />
            <div className="h-4"></div>
            <Button type="submit" disabled={createProject.isPending}>
              Create Project
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default CreatePage;
