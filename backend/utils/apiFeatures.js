const qs = require('qs');

class ApiFeatures {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
    search(){
        const keyword = this.queryStr.keyword 
            ? {
                name: {
                    $regex: this.queryStr.keyword,
                    $options: "i" //case insensetive
                }
            } : {};
        this.query = this.query.find({...keyword});
        return this;
    }

    filter(){
        let queryCopy = {...this.queryStr};
        queryCopy = qs.parse(queryCopy);

        //removing some fields for category
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((key) => delete queryCopy[key]);

        //Filter for Price and Rating
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
        //gt -> greater than, lt-> lesser than, gte -> greater than and equal to, lte-> lesser than and equal to

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1;

        const skip = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
};
module.exports = ApiFeatures