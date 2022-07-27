import { MenuItem, Select } from "@mui/material"
import { useEffect, useState } from "react"
import { DisplayOptionFn, ProcessedOutput } from "./ChessboardDetector"

interface Props {
  setDisplayOptionFn: React.Dispatch<React.SetStateAction<DisplayOptionFn | undefined>>
}
export const DisplayOptionSelect = (props: Props) => {

    const [displayOptionLabel, setDisplayOptionLabel] = useState<string>("gray") 

    const displayOptions: {label: string, fn: DisplayOptionFn}[] = [
      { label: "gray", fn: (output: ProcessedOutput) => output.imgGray },
      { label: "fourier", fn: (output: ProcessedOutput) => output.imgFourierLogMagnitude },
      { label: "fourier center", fn: (output: ProcessedOutput) => output.imgMagnitudeCenter },
    ]

    useEffect( () => {
      props.setDisplayOptionFn( () => displayOptions.find(displayOption => displayOption.label === displayOptionLabel)!.fn )
    }, [displayOptionLabel])

    return (
    <Select
        value={displayOptionLabel}
        label="Output"
        onChange={(e) => {
          setDisplayOptionLabel(e.target.value)
        }}
      >
        {
          displayOptions.map((option, index) => (
            <MenuItem key={index} value={option.label}>{option.label}</MenuItem>
          ))
        }
      </Select>
    )
}