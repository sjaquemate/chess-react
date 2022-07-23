import { MenuItem, Select } from "@mui/material"
import { useEffect, useState } from "react"
import { DisplayOptionFn, ProcessedOutput } from "../App"

interface Props {
  setDisplayOptionFn: React.Dispatch<React.SetStateAction<DisplayOptionFn | undefined>>
}
export const DisplayOptionSelect = (props: Props) => {

    type DisplayOptionLabel = "gray" | "fourier" | "warped"
    const [displayOptionLabel, setDisplayOptionLabel] = useState<DisplayOptionLabel>("gray") 

    const displayOptions: {label: DisplayOptionLabel, fn: DisplayOptionFn}[] = [
      { label: "warped", fn: (output: ProcessedOutput) => output.warped },
      { label: "gray", fn: (output: ProcessedOutput) => output.imgGray },
      { label: "fourier", fn: (output: ProcessedOutput) => output.imgFourierLogMagnitude },
    ]

    useEffect( () => {
      props.setDisplayOptionFn( () => displayOptions.find(displayOption => displayOption.label === displayOptionLabel)!.fn )
    }, [displayOptionLabel])

    return (
    <Select
        value={displayOptionLabel}
        label="Output"
        onChange={(e) => {
          const value = e.target.value as DisplayOptionLabel
          setDisplayOptionLabel(value)
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