import { environment } from "src/enviroments/enviroments";

export function  isSelected(value: string,checkList:Array<any>): boolean {
    return checkList.includes(value);
  }

  export function toggleCheckbox(option:string,checkedItems:Array<any>):any[] {
    
    const index = checkedItems.indexOf(option);
    if (index === -1) {
      checkedItems.push(option);
      return checkedItems;
    } else {
      checkedItems.splice(index, 1);
      return checkedItems;
    }
}
export function GET_TEMPLATE(value:string){
    return (
    environment.HOST +
    'download/template/' +
    (value || '1')
  )
}

export function IS_ARRAY_EMPTY_OR_NULL(data: any): boolean {
  if (!data || data?.length === 0) {
    return true;
  }
  if(data?.length>0) return data.every((element:any) => element === null);
  return true;
}