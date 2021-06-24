const Product = require("../models/product");
const User = require("../models/user");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    console.log(req.body);
    req.body.slug = slugify(req.body.title);
    const newProduct = await new Product(req.body).save();
    res.json(newProduct);
  } catch (err) {
    // console.log(err.message);
    // res.status(400).send("Create product failed");
    res.status(400).json({
      err: err.message,
    });
  }
};

exports.listAll = async (req, res) => {
  try {
    let products = await Product.find({})
      .limit(parseInt(req.params.count))
      .populate("category")
      .populate("subs")
      .sort([["createdAt", "desc"]])
      .exec();

    res.json(products);
  } catch (err) {
    res.sendStatus(400);
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec();

    res.json(deleted);
  } catch (err) {
    // console.log(err);
    return res.status(400).send("Product delete failed");
  }
};

exports.read = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
    })
      .populate("category")
      .populate("subs")
      .exec();

    res.json(product);
  } catch (err) {
    // console.log(err);
    return res.status(400).send("Product fetch failed");
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    ).exec();

    res.json(updated);
  } catch (err) {
    // console.log(err);
    return res.status(400).send("Product update failed");
  }
};

exports.list = async (req, res) => {
  try {
    const { sort, order, page } = req.body;

    const currentPage = page || 1;
    const perPage = 4;

    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate("category")
      .populate("subs")
      .sort([[sort, order]])
      .limit(perPage)
      .exec();

    res.json(products);
  } catch (err) {
    // console.log(err.message);
    // res.status(400).send("Create product failed");
    res.status(400).json({
      err: err.message,
    });
  }
};

exports.productsCount = async (req, res) => {
  try {
    const total = await Product.find({}).estimatedDocumentCount().exec();

    res.json(total);
  } catch (err) {
    // console.log(err.message);
    // res.status(400).send("Create product failed");
    res.status(400).json({
      err: err.message,
    });
  }
};

exports.productStar = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).exec();
    const user = await User.findOne({ email: req.user.email }).exec();
    const { star } = req.body;

    // checking  if currently logged in user have already added rating to this product
    let existingRatingObject = product.ratings.find(
      (ele) => ele.postedBy.toString() === user._id.toString()
    );

    // if user haven't left rating, push it
    if (existingRatingObject === undefined) {
      let ratingAdded = await Product.findByIdAndUpdate(
        product._id,
        {
          $push: { ratings: { star: star, postedBy: user._id } },
        },
        { new: true }
      ).exec();
      console.log("ratingAdded", ratingAdded);
      res.json(ratingAdded);
    } else {
      // if user have already left rating, update it

      const ratingUpdated = await Product.updateOne(
        {
          ratings: { $elemMatch: existingRatingObject },
        },
        {
          $set: { "ratings.$.star": star },
        },
        { new: true }
      ).exec();
      console.log("ratingUpdated", ratingUpdated);
      res.json(ratingUpdated);
    }
  } catch (err) {
    res.sendStatus(400);
  }
};

exports.listRelated = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).exec();
    const related = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
    })
      .limit(4)
      .populate("category")
      .populate("postedBy")
      .exec();

    res.json(related);
  } catch (err) {
    res.sendStatus(400);
  }
};

// SEARCH / FILTER

const handleQuery = async (req, res, query) => {
  try {
    const products = await Product.find({ $text: { $search: query } })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .populate("postedBy", "_id name")
      .exec();

    res.json(products);
  } catch (err) {
    res.sendStatus(400);
  }
};

const handlePrice = async (req, res, price) => {
  try {
    let products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .populate("postedBy", "_id name")
      .exec();

    res.json(products);
  } catch (err) {
    // console.log(err);
    res.sendStatus(400);
  }
};

const handleCategory = async (req, res, category) => {
  try {
    let products = await Product.find({ category })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .populate("postedBy", "_id name")
      .exec();

    res.json(products);

  } catch (err) {
    // console.log(err);
    res.sendStatus(400);
  };

};

const handleStar = (req, res, stars) => {
  Product.aggregate([
    {
      $project: {
        document: "$$ROOT",
        // title:"$title",
        floorAverage: {
          $floor: { $avg: "$ratings.star" }
        }
      },
    },
    { $match: { floorAverage: stars } }
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) console.log("AGGREGATE ERROR", err);
      Product.find({ _id: aggregates })
        .populate("category", "_id name")
        .populate("subs", "_id name")
        .populate("postedBy", "_id name")
        .exec((err, products) => {
          if (err) console.log("PRODUCT AGGREGATE ERROR", err)
          res.json(products);
        });

    })
};

const handleSub = async (req, res, sub) => {
  try {
    const products = await Product.find({ subs: sub })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .populate("postedBy", "_id name")
      .exec();

    res.json(products);
  } catch (err) {
    res.sendStatus(400);
  }
}

const handleShipping = async (req, res, shipping) => {
  try {
    const products = await Product.find({ shipping })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .populate("postedBy", "_id name")
      .exec();

    res.json(products);
  } catch (err) {
    res.sendStatus(400);
  }
}
const handleColor = async (req, res, color) => {
  try {
    const products = await Product.find({ color })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .populate("postedBy", "_id name")
      .exec();

    res.json(products);
  } catch (err) {
    res.sendStatus(400);
  }
}
const handleBrand = async (req, res, brand) => {
  try {
    const products = await Product.find({ brand })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .populate("postedBy", "_id name")
      .exec();

    res.json(products);
  } catch (err) {
    res.sendStatus(400);
  }
}

exports.searchFilters = async (req, res) => {
  try {
    const { query, price, category, stars, sub, shipping, color, brand } = req.body;

    if (query) {
      // console.log("Query ===>", query);
      await handleQuery(req, res, query);
    }

    // price [1000, 4000]
    if (price !== undefined) {
      // console.log("Price ===>", price);
      await handlePrice(req, res, price);
    }

    if (category) {
      // console.log("Category ===>", category);
      await handleCategory(req, res, category);
    }

    if (stars) {
      // console.log("stars ===>", stars);
      await handleStar(req, res, stars);
    }
    if (sub) {
      // console.log("subs===>", sub);
      await handleSub(req, res, sub)
    }
    if (shipping) {
      // console.log("shipping===>", shipping);
      await handleShipping(req, res, shipping)

    }
    if (color) {
      // console.log("color===>", color);
      await handleColor(req, res, color)

    }
    if (brand) {
      // console.log("brand===>", brand);
      await handleBrand(req, res, brand)
    }
  } catch (err) {
    res.sendStatus(400);
  }
};
