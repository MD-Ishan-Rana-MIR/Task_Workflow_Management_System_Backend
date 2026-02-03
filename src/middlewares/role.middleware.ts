export const roleMiddleware = (roles: string[]) => {
  return (req: any, res: any, next: any) => {
    console.log("role is", roles)
    if (!roles.includes(req.headers.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
