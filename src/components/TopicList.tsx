import React from 'react';
import { Topic } from '../types';

interface TopicListProps {
  topics: Topic[];
  onSelect: (topic: Topic) => void;
}

const TopicList: React.FC<TopicListProps> = ({ topics, onSelect }: TopicListProps) => (
  <div className="grid grid-cols-1 gap-3 p-4">
    {topics.map((topic: Topic) => (
      <button
        key={topic.id}
        className={`rounded-lg p-4 shadow flex items-center justify-between transition font-semibold text-lg ${
          topic.locked ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-100 hover:bg-green-200'
        }`}
        onClick={() => !topic.locked && onSelect(topic)}
        disabled={topic.locked}
      >
        <span>{topic.name}</span>
        {topic.locked && <span className="ml-2">🔒</span>}
      </button>
    ))}
  </div>
);

export default TopicList; 