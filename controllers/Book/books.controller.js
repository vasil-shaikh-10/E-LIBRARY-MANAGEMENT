const Books = require("../../models/Book/books.models")

const BookCreate = async(req,res)=>{
    try {
        let {title,author,genre,availability}=req.body
        if(!title || !author || !genre || !availability){
            return res.status(400).json({success:false,message:"All Fields Are Required"})
        }

        let Booksobj = new Books({
            title,author,genre,availability,createBy:req.user._id
        });
        await Booksobj.save()
        res.status(201).json({success:true,create:{
            ...Booksobj._doc,
        }})
    } catch (error) {
        console.log("Error in BookCreate controller", error.message)
        res.status(500).json({success:false,message:"Interna; Server Error"})
    }
}

const BookShow = async(req,res)=>{
    try {
        let AllBook = await Books.find()
        res.status(201).json({success:true,Data:{
            ...AllBook,
        }})
    } catch (error) {
        console.log("Error in BookShow controller", error.message)
        res.status(500).json({success:false,message:"Interna; Server Error"})
    }
}

const BookShowId = async(req,res)=>{
    let {id} = req.params
    try {
        let Data=await Books.findById(id)
        if(!Data){
            return res.status(401).json({success:false,message:"No Data Found !"})
        }

        res.status(200).json({success:true,data:Data})
    } catch (error) {
        console.log("Error in BookShowId controller", error.message)
        res.status(500).json({success:false,message:"Interna; Server Error"})
    }
}

const BookUpdate = async(req,res)=>{
    let {id} = req.params
    try {
        let {title,author,genre,availability} = req.body
        let data = await Books.findById(id)

        if(!data){
            return res.status(401).json({success:false,message:"No Data Found !"})
        }
        if (!data.createBy.equals(req.user._id)) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        let BooksUpdate = await Books.findByIdAndUpdate(id,{
            title,author,genre,availability,createBy:req.user._id
        },{
            new: true, // Return the updated document
            runValidators: true, // Ensure validation rules are applied
        })
        res.status(201).json({success:true,data:BooksUpdate})
    } catch (error) {
        console.log("Error in BookShowId controller", error.message)
        res.status(500).json({success:false,message:"Interna; Server Error"})
    }
}

const BookDelete = async(req,res)=>{
    let {id} = req.params
    try {
        let data = await Books.findById(id);
        if(!data){
            return res.status(401).json({success:false,message:"No Data Found !"})
        }
        if (!data.createBy.equals(req.user._id)) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        await Books.findByIdAndDelete(id)
        res.status(201).json({success:true,message:"Delete Successfully..."})
    } catch (error) {
        console.log("Error in BookDelete controller", error.message)
        res.status(500).json({success:false,message:"Interna; Server Error"})
    }
}

const BooksBorrow =async(req,res)=>{
    let {id} = req.params
    try {
        let data = await Books.findById(id)
        if(!data){
            return res.status(401).json({success:false,message:"No Data Found !"})
        }
        if(data.availability == true){
            data.availability = false;
            data.borrowAdd.push({userId:req.user._id})
            data.save()
            res.status(201).json({success:true,message:"Borrow Successfully..."})
        }else{
            res.status(201).json({success:true,message:"Book Is Not availability..."})
        }
    } catch (error) {
        console.log("Error in BooksBorrow controller", error.message)
        res.status(500).json({success:false,message:"Interna; Server Error"})
    }
}

const BookReturn = async(req,res)=>{
    let {id} = req.params
    try {
        const data = await Books.findById(id)
        if(!data){
            return res.status(401).json({success:false,message:"No Data Found !"})
        } 
        data.borrowAdd=data.borrowAdd.map((ele)=>{
            if (ele.userId.equals(req.user._id) && !ele.returnDate) {
                // Update returnDate for the matching record
                return { ...ele.toObject(), returnDate: Date.now() }; // Convert Mongoose subdocument to plain object
            }
            return ele; 
        })
        data.availability = true;
        await data.save()
        res.json({msg:"done",data:data})
    } catch (error) {
        console.log("Error in BooksBorrow controller", error.message)
        res.status(500).json({success:false,message:"Interna; Server Error"})
    }
    
}
module.exports = {BookCreate,BookShow,BookShowId,BookUpdate,BookDelete,BooksBorrow,BookReturn}