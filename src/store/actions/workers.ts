export type WorkersAction = {
  type: "addWorkers",
  value: number
}

export const addWorkers = (value: number): WorkersAction => ({
    type: "addWorkers",
    value,
})

export const subtractWorkers = (value: number): WorkersAction => ({
    type: "addWorkers",
    value: -value,
})