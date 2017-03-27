import { CFTableDataService } from './../utility/cf-table-data.service';
import { CFPage } from './cfpage/cf-page';


export class CFPagination{
    cftabledata:CFTableDataService;
    page_available:Array<CFPage>;
    current_page:any = 1;
    constructor(cftabledata:CFTableDataService){
        this.cftabledata = cftabledata;
        this.genPageAvailable();
        this.setCurrentPage(this.current_page);
        this.listen();
    }
    
    private listen(){
        this.cftabledata.attach().subscribe((res)=>{
                
                this.genPageAvailable();
         
        });
    }

    genPageAvailable(){
        let max_pages = 7;
        var res_arr = [];
        let total_page = Math.ceil(this.cftabledata.getDataTotal() / this.cftabledata.getSize());
        if(total_page <= max_pages){
            total_page >= 2 ?   this.genCFPageAvailable(new Array(total_page).fill(1).map((x,i)=>i+1)) :  this.genCFPageAvailable([1]);
            return false;
        }
     
        if(this.getCurrentPage() >= 5){
            let prev = this.getCurrentPage() - 1;
            
            res_arr = [1,"...",prev,this.getCurrentPage()];
            if(this.getCurrentPage() + 1 <= this.cftabledata.getDataTotal()){
                let next = this.getCurrentPage() + 1;
                res_arr.push(next);
            }

        }else{
            res_arr = [1,2,3,4,5];
        }

        if(this.getCurrentPage() + 2 < total_page){
            res_arr.push("...");
            res_arr.push(total_page);
        }
       
        if(this.getCurrentPage() + 3 >= total_page){
            
            res_arr = [1,"...",total_page-4,total_page-3,total_page-2,total_page-1,total_page]
        }
        this.genCFPageAvailable(res_arr);
        
    }
    
    private genCFPageAvailable(page_available:Array<any>){
        this.page_available = page_available.map((page)=>{
            if(page != "..."){
                return new CFPage(page+"",page+"");
            }else{
                return new CFPage(page+"","none");
            }
         }).map((pageitem)=>{
            if(pageitem.value == this.current_page){
                pageitem.setCurrent(true);  
            }else{
                pageitem.setCurrent(false);
            }
            return pageitem;
         });

    }

    getPageAvailable():Array<CFPage>{
        return this.page_available;
    }

    getCurrentPage():number{
        return this.current_page;
    }

    setPage(page:any){
        if(page == "none"){
            return false;
        }
        this.setCurrentPage(Number(page));
    }

    setCurrentPage(current_page:number):void{
        // let current_page_num = Number(current_page);
        this.current_page = current_page;
        this.cftabledata.setOffset(this.cftabledata.getSize() * (current_page-1));
    }

    getTotal():number{
        return this.cftabledata.getDataTotal();
    }

}

