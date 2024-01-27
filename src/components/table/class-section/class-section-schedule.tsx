import { Fragment, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import InputCol from "./input-col";
import InputFaculty from "../room/input/input-faculty";
import ColumnName from "../rows/schedule-list/names";
import { useScheduleStore } from "@/stores/schedule";

import useScheduleList from "@/hooks/useScheduleList";
import { getSectionDetails } from "@/services/api/schedule";
import { SCHEDULES } from "@/constants/initial";
import { ISchedule } from "@/types/api";

interface RightValues {
  subject: string;
  instructor: string;
}

function ClassSchedule() {
  const [state, dispatch, handleInputChange] = useScheduleList();
  const [searchParams] = useSearchParams();
  const { setSchedules, resetSchedules } = useScheduleStore();

  const [uniqueOddValues, setUniqueOddValues] = useState<RightValues[]>();
  const [uniqueEvenValues, setUniqueEvenValues] = useState<RightValues[]>();

  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) {
      dispatch({ type: "RESET" });
      resetSchedules();
      return;
    }

    const fetchData = async () => {
      const roomDetails = await getSectionDetails(id);
      dispatch({ type: "SET_ALL", value: roomDetails });
    };

    fetchData();
  }, [searchParams]);

  // copy state globally
  useEffect(() => {
    setSchedules(state);
    schedDetailsLazyAlgo(state);
  }, [state]);

  const schedDetailsLazyAlgo = function (state: ISchedule[]) {
    // stackleague big-brain solution
    const formatted: RightValues[] = [];
    for (let i = 0; i < state.length; i++) {
      for (let j = 0; j < state[i].schedules.length; j++) {
        const schedule = state[i].schedules[j];
        if (schedule.course === "" || schedule.section === "") continue;

        formatted.push({
          instructor: schedule.initials,
          subject: schedule.course,
        });
      }
    }

    // another big brain move ooohoohohohh~
    const unique: RightValues[] = [];
    for (let i = 0; i < formatted.length; i++) {
      if (
        !unique.find(
          (data) =>
            data.instructor === formatted[i].instructor &&
            data.subject === formatted[i].subject,
        )
      )
        unique.push(formatted[i]);
    }

    unique.sort((a: RightValues, b: RightValues) => {
      return a.subject.localeCompare(b.subject);
    });

    const uniqueOdd: RightValues[] = [];
    const uniqueEven: RightValues[] = [];

    for (let i = 0; i < unique.length; i++) {
      if (i % 2 === 0) uniqueEven.push(unique[i]);
      else uniqueOdd.push(unique[i]);
    }

    setUniqueEvenValues(uniqueEven);
    setUniqueOddValues(uniqueOdd);
  };

  return (
    <>
      {SCHEDULES.map((schedule, index) => (
        <Fragment key={index}>
          {/* template */}
          <tr className="h-8 text-center">
            <td rowSpan={2}>{schedule}</td>

            <InputCol
              stateIndex={index}
              state={state}
              handleInputChange={handleInputChange}
            />

            {index < 5 && (
              <>
                <td>
                  {uniqueEvenValues && index < uniqueEvenValues.length
                    ? uniqueEvenValues[index].subject
                    : ""}
                </td>
                <td>
                  {uniqueEvenValues && index < uniqueEvenValues.length
                    ? uniqueEvenValues[index].instructor
                    : ""}
                </td>
                <td></td>
              </>
            )}

            {/* Columns for the names in the right side of the table */}
            {index == 5 && (
              <ColumnName rowSpan={4} name="" title="Faculty Assigned" />
            )}

            {index == 7 && (
              <ColumnName rowSpan={4} name="" title="Dean CEAFA" />
            )}

            {index == 9 && (
              <ColumnName
                rowSpan={10}
                name=""
                title="Executive Director, Main II"
              />
            )}
          </tr>

          {/* sections */}
          <tr className="h-8 w-fit text-center">
            <InputFaculty
              stateIndex={index}
              state={state}
              handleInputChange={handleInputChange}
            />

            {index < 5 && (
              <>
                <td>
                  {uniqueOddValues && index < uniqueOddValues.length
                    ? uniqueOddValues[index].subject
                    : ""}
                </td>
                <td>
                  {uniqueOddValues && index < uniqueOddValues.length
                    ? uniqueOddValues[index].instructor
                    : ""}
                </td>
                <td></td>
              </>
            )}
          </tr>
        </Fragment>
      ))}
    </>
  );
}

export default ClassSchedule;
