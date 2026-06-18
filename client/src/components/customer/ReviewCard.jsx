import { FiStar } from 'react-icons/fi';
import { formatDate } from '../../utils/helper';

const ReviewCard = ({ review }) => (
  <div className="card mb-3">
    <div className="flex items-start justify-between mb-2">
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
          {review.customerId?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <p className="font-medium text-gray-800 text-sm">{review.customerId?.name || 'User'}</p>
          <p className="text-gray-400 text-xs">{formatDate(review.createdAt)}</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {[1,2,3,4,5].map(s => (
          <FiStar key={s} size={14} className={s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
        ))}
      </div>
    </div>
    <p className="text-gray-600 text-sm">{review.review}</p>
  </div>
);

export default ReviewCard;
