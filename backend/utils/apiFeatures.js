class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const location = this.queryStr.location
      ? {
          address: {
            $regex: this.queryStr.location,
            $options: 'i',
          },
        }
      : {};
    // console.log(location);

    const name = this.queryStr.name
      ? {
          name: {
            $regex: this.queryStr.name,
            $options: 'i',
          },
        }
      : {};
    const category = this.queryStr.category
      ? {
          category: {
            $regex: this.queryStr.category,
            $options: 'i',
          },
        }
      : {};
    this.query = this.query.find({ ...location, ...name });
    return this;
  }
  filter() {
    const queryCopy = { ...this.queryStr };
    // console.log(queryCopy);
    // Remove fields from query
    const removeFields = ['location', 'page'];
    removeFields.forEach((el) => delete queryCopy[el]);
    // console.log(queryCopy);
    this.query = this.query.find(queryCopy);
    return this;
  }

  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

export default APIFeatures;
