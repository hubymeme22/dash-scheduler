import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteFaculty, getFaculties } from "@/services/api/faculty";
import { queryClient } from "@/App";

function FacultyList() {
  const { toast } = useToast();

  const { data } = useQuery({
    queryKey: ["faculty-list"],
    queryFn: getFaculties,
  });

  const mutation = useMutation({
    mutationFn: deleteFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faculty-list"] });
      toast({
        description: "Faculty successfully deleted.",
      });
    },
  });

  return (
    <div className="flex h-full flex-grow flex-col gap-2">
      <div>
        <h1 className="text-xl font-bold">Faculty List</h1>
        {/* Button add new account pop up modal */}
      </div>

      <hr />

      {data &&
        data.map((account) => (
          <div
            key={account.id}
            className="flex items-center justify-between rounded p-2 hover:bg-slate-200"
          >
            <p className="text-lg">{account.name}</p>
            <Button
              variant={"destructive"}
              onClick={() => mutation.mutate(account.initials)}
            >
              <Trash />
            </Button>
          </div>
        ))}
    </div>
  );
}

export default FacultyList;