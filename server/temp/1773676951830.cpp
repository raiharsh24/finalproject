// Write your code here#include <vector>
#include <unordered_map>
#include <iostream>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        std::unordered_map<int, int> numToIndex;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (numToIndex.find(complement) != numToIndex.end()) {
                return {numToIndex[complement], i};
            }
            numToIndex[nums[i]] = i;
        }
        // As per problem constraints, a solution is guaranteed to exist.
        // This line is for compilation purposes if no return is found (which won't happen).
        return {}; 
    }
};

// Example Usage:
int main() {
    Solution sol;
    std::vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    std::vector<int> indices = sol.twoSum(nums, target);
    if (!indices.empty()) {
        std::cout << "Indices: [" << indices[0] << ", " << indices[1] << "]" << std::endl; // Output: Indices: [0, 1]
    }
    return 0;
}
