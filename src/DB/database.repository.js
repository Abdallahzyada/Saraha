export const findOne = async ({model, filter={}, select="", option={}}={}) => {
    
    const doc = model.findOne(filter);
    if(select.length) doc.select(select);
    if(option.populate) doc.populate(option.populate);
    if(option.lean) doc.lean();

    return await doc.exec();
};

export const create = async ({model, data, options={validateBeforeSave:true}} = {})=>{
    return await model.create(data, options);
};

export const createOne = async ({model, data, options={validateBeforeSave:true}} = {})=>{
    const [doc] =  ( model.create(data, options)) || [];
    return await doc;
};

export const insertMany = async ({model, data} = {}) => {
    return await model.insertMany(data);
};

export const findById = async ({model, id, select="", option={}}={}) => {
    
    const doc = model.findById(id);
    if(select.length) doc.select(select);
    if(option.populate) doc.populate(option.populate);
    if(option.lean) doc.lean();

    return await doc.exec();
};

export const find = async ({model, filter={}, select="", option={}}={}) => {
    
    const doc = model.find(filter);
    if(select.length) doc.select(select);
    if(option.populate) doc.populate(option.populate);
    if(option.lean) doc.lean();
    if(option?.skip) doc.skip(option.skip);
    if(option?.limit) doc.limit(option.limit);

    return await doc.exec();
};

export const updateOne = async ({model, filter, update, option={}}={}) => {
    
    return await model.updateOne(filter, {...update, $inc:{__v: 1}}, option);
};

export const findOneAndUpdate = async ({model, filter, update, option={}}={}) => {
    
    return await model.findOneAndUpdate(filter, {...update, $inc:{__v: 1}}, {...option, new:true, runValidators:true});
};

export const findByIdAndUpdate = async ({model, id, update, option={}}={}) => {
    
    return await model.findByIdAndUpdate(id, {...update, $inc:{__v: 1}}, {...option, new:true, runValidators:true});
};

export const deleteOne = async ({model, filter}={}) => {
    
    return await model.deleteOne(filter);
};

export const deleteMany = async ({model, filter}={}) => {
    
    return await model.deleteMany(filter);
};