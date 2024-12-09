

interface Risk
{

}


export interface ILikelihood
{

  low:levelData,
  medium:levelData,
  high:levelData,
  critical:levelData
}
export interface levelData
{
  value:number,
  color:string
}

export interface IImpact
{

    low:levelData,
    medium:levelData,
    high:levelData,
    critical:levelData
}

