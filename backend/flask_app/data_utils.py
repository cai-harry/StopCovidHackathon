import syft as sy
import torch

def generate_virtual_workers(n, hook):
  workers = []
  for i in range(n):
    workers.append(sy.VirtualWorker(hook, id=("hospital" + str(i + 1))))
  return workers

def clear_workers(workers):
  for w in workers:
    w.clear_objects()

def split_into_lists(data, labels):
  record_list = list()
  result_list = list()
  for _, row in data.iterrows():
    record_list.append(row)
  for row in labels:
    converted_label = float(row)
    result_list.append(converted_label)
  return record_list, result_list

def convert_to_tensors(data):
  tensors = list()
  for record in data:
    tensors.append(torch.tensor(record))
  return tensors
