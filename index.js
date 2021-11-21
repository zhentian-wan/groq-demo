import fs from "fs-extra"
import { groq } from "./lib.js"

let pokedex = await fs.readJson("./pokedex.json")
/*
let query = await groq`
    *[!(num in *[].next_evolution[].num)]
    [0..3]
    {
        name,
        num,
        "evolutions": *[num in ^.next_evolution[].num]{name, num}
    }
`*/

let query = await groq`
    *[]
    [0..3]
    {
        name,
        type,
        "matchup": *[
            count(
                weaknesses[@ in ^.^.type]
            ) > 0
        ]
            [0...3]
                {name, type, weaknesses, "message": ^.name + " vs. " + name}
    }
`

let result = await query(pokedex)

console.log(result)
