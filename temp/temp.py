def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1

my_list = [10, 4, 7, 2, 8, 5]
target_element = 2

result = linear_search(my_list, target_element)

if result != -1:
    print("Element", target_element, "found at index", result)
else:
    print("Element", target_element, "not found in the list")