import { UnathenticatedError } from '../errors/index.js';

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new UnathenticatedError('Not authorized to access this route!');
};

export default checkPermissions;
