// Simple profile controller built on top of auth middleware attaching req.user

export const getMe = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
    res.json({ success: true, data: req.user });
  } catch (err) {
    next(err);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, error: "name is required" });

    req.user.name = name;
    await req.user.save();

    res.json({ success: true, data: req.user });
  } catch (err) {
    next(err);
  }
};
