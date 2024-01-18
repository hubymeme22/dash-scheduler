import { DAYS } from "@/constants/initial";
import { ISchedule } from "@/types/api";
import { ChangeEvent, Fragment } from "react";

interface DayListProps {
  stateIndex: number;
  state: ISchedule[];
  handleInputChange: (e: ChangeEvent<HTMLInputElement>, index: number) => void;
}

function InputCol({ stateIndex, state, handleInputChange }: DayListProps) {
  return (
    <>
      {DAYS.map((day, index) => (
        <Fragment key={index}>
          {/*  */}
          <td rowSpan={1}>
            <input
              type="text"
              name={`${day}-course`}
              value={state[stateIndex].schedules[index].course}
              onChange={(e) => handleInputChange(e, stateIndex)}
              tabIndex={index}
            />
          </td>

          {/* The big field */}
          <td rowSpan={2}>
            <input
              type="text"
              name={`${day}-room`}
              value={state[stateIndex].schedules[index].room}
              onChange={(e) => handleInputChange(e, stateIndex)}
              tabIndex={index}
            />
          </td>
        </Fragment>
      ))}
    </>
  );
}

export default InputCol;